'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { slugify } from '@/lib/format'
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

export async function createForm(formData: FormData) {
  await requireUser(['EVENTS_MANAGER', 'PROGRAM_MANAGER'])
  const form = await prisma.formDefinition.create({ data: formPayload(formData) })
  revalidatePath('/admin/forms')
  redirect(`/admin/forms/${form.id}?saved=1`)
}

export async function updateForm(formId: string, formData: FormData) {
  await requireUser(['EVENTS_MANAGER', 'PROGRAM_MANAGER'])
  await prisma.formDefinition.update({ where: { id: formId }, data: formPayload(formData) })
  revalidatePath('/admin/forms')
  revalidatePath(`/admin/forms/${formId}`)
  redirect(`/admin/forms/${formId}?saved=1`)
}

export async function deleteForm(formId: string) {
  await requireUser(['EVENTS_MANAGER', 'PROGRAM_MANAGER'])

  const form = await prisma.formDefinition.findUniqueOrThrow({
    where: { id: formId },
    include: { _count: { select: { events: true, cohorts: true } } },
  })

  // Deleting a form that's still wired to an Event or Cohort would silently
  // orphan the reference (the FK is nullable, so Prisma wouldn't stop us) —
  // block it here instead so an admin has to detach it first.
  if (form._count.events > 0 || form._count.cohorts > 0) {
    throw new Error(
      `"${form.name}" is still attached to ${form._count.events} event(s) and ${form._count.cohorts} cohort(s). Detach it from those before deleting.`,
    )
  }

  await prisma.formDefinition.delete({ where: { id: formId } })
  revalidatePath('/admin/forms')
  redirect('/admin/forms?deleted=1')
}
