'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser, type SessionUser } from '@/lib/auth'
import { slugify } from '@/lib/format'
import { canManageEvents, canManagePrograms } from '@/lib/rbac'
import type { ConfirmationType, Prisma } from '@prisma/client'
import type { FormFieldConfig } from '@/lib/forms'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

/**
 * The field list arrives as a single JSON string (serialized client-side by
 * FormBuilder before submit). Validate just enough to guarantee every field
 * can be rendered on the public side — id/type/label are the minimum a
 * DynamicField needs.
 */
function parseFields(raw: string): FormFieldConfig[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw || '[]')
  } catch {
    throw new Error('Fields payload is not valid JSON.')
  }
  if (!Array.isArray(parsed)) {
    throw new Error('Fields payload must be an array.')
  }
  for (const item of parsed) {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as Record<string, unknown>).id !== 'string' ||
      typeof (item as Record<string, unknown>).type !== 'string' ||
      typeof (item as Record<string, unknown>).label !== 'string'
    ) {
      throw new Error('Each field must have an id, type, and label.')
    }
  }
  return parsed as FormFieldConfig[]
}

function formPayload(formData: FormData) {
  const name = str(formData, 'name')
  return {
    name,
    slug: slugify(str(formData, 'slug') || name),
    fields: parseFields(str(formData, 'fields')) as unknown as Prisma.InputJsonValue,
    confirmationType: str(formData, 'confirmationType') as ConfirmationType,
    confirmationMessage: str(formData, 'confirmationMessage') || null,
    redirectUrl: str(formData, 'redirectUrl') || null,
    notificationEmails: str(formData, 'notificationEmails')
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean),
  }
}

/**
 * The events/programs checked in the Form Builder's "Attach To" section. A
 * list stays undefined (left untouched on save) when the role can't edit that
 * entity — the builder hides it for them, so an empty list there would
 * otherwise read as "detach everything".
 */
function attachTargets(user: SessionUser, formData: FormData) {
  const ids = (key: string) => formData.getAll(key).map(String).filter(Boolean).map((id) => ({ id }))
  return {
    events: canManageEvents(user) ? ids('eventIds') : undefined,
    programs: canManagePrograms(user) ? ids('programIds') : undefined,
  }
}

/** Public pages render the attached form's fields, so they go stale on any save. */
function revalidateFormPaths(formId?: string) {
  revalidatePath('/admin/forms')
  if (formId) revalidatePath(`/admin/forms/${formId}`)
  revalidatePath('/events/[slug]', 'page')
  revalidatePath('/programs/[slug]', 'page')
}

export async function createForm(formData: FormData) {
  const user = await requireUser(['EVENTS_MANAGER', 'PROGRAM_MANAGER'])
  const { events, programs } = attachTargets(user, formData)
  const form = await prisma.formDefinition.create({
    data: {
      ...formPayload(formData),
      events: events && { connect: events },
      programs: programs && { connect: programs },
    },
  })
  revalidateFormPaths()
  redirect(`/admin/forms/${form.id}?saved=1`)
}

export async function updateForm(formId: string, formData: FormData) {
  const user = await requireUser(['EVENTS_MANAGER', 'PROGRAM_MANAGER'])
  const { events, programs } = attachTargets(user, formData)
  // `set` detaches whatever this form was attached to but is no longer
  // checked, and attaches (replacing any other form on) whatever is checked.
  await prisma.formDefinition.update({
    where: { id: formId },
    data: {
      ...formPayload(formData),
      events: events && { set: events },
      programs: programs && { set: programs },
    },
  })
  revalidateFormPaths(formId)
  redirect(`/admin/forms/${formId}?saved=1`)
}

export async function deleteForm(formId: string) {
  await requireUser(['EVENTS_MANAGER', 'PROGRAM_MANAGER'])

  const form = await prisma.formDefinition.findUniqueOrThrow({
    where: { id: formId },
    include: { _count: { select: { events: true, programs: true, cohorts: true } } },
  })

  // Deleting a form that's still wired to an Event, Program or Cohort would
  // silently orphan the reference (the FK is nullable, so Prisma wouldn't stop
  // us) — block it here instead so an admin has to detach it first.
  const { events, programs, cohorts } = form._count
  if (events > 0 || programs > 0 || cohorts > 0) {
    throw new Error(
      `"${form.name}" is still attached to ${events} event(s), ${programs} program(s) and ${cohorts} cohort(s). Detach it from those before deleting.`,
    )
  }

  await prisma.formDefinition.delete({ where: { id: formId } })
  revalidatePath('/admin/forms')
  redirect('/admin/forms?deleted=1')
}
