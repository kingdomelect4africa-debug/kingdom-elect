'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/format'
import type { FormFieldConfig } from '@/lib/forms'
import type { PillarTag } from '@prisma/client'

export type RegistrationActionState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

const PILLAR_MAP: Record<string, PillarTag> = {
  Educator: 'EDUCATOR',
  Leader: 'LEADER',
  Entrepreneur: 'ENTREPRENEUR',
  Creative: 'CREATIVE',
  Technocrat: 'TECHNOCRAT',
}

export async function submitRegistration(
  _prevState: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  // eventSlug travels as a hidden form field rather than a `.bind()`-ed
  // argument — combining `.bind()` with `useActionState` reproducibly hung
  // this exact Next 16 + Turbopack dev setup (the action's own DB writes
  // completed instantly; the HTTP response itself never returned). Every
  // other working useActionState form here also passes no bound arguments,
  // so this keeps the pattern consistent rather than chasing the framework
  // internals further.
  const eventSlug = (formData.get('eventSlug') as string | null) ?? ''

  const event = await prisma.event.findUnique({
    where: { slug: eventSlug },
    include: { registrationForm: true },
  })

  if (!event) return { status: 'error', message: 'This event could not be found.' }
  if (event.registrationStatus === 'CLOSED') {
    return { status: 'error', message: 'Registration for this event is closed.' }
  }
  if (!event.registrationForm) {
    return { status: 'error', message: 'Registration is not yet configured for this event.' }
  }

  const fields = event.registrationForm.fields as unknown as FormFieldConfig[]
  const responses: Record<string, string | boolean> = {}

  for (const field of fields) {
    if (field.type === 'checkbox' || field.type === 'consent') {
      const checked = formData.get(field.id) === 'on'
      if (field.required && !checked) {
        return { status: 'error', message: `Please confirm: ${field.label}` }
      }
      responses[field.id] = checked
    } else if (field.type === 'file') {
      const file = formData.get(field.id)
      // File storage is not wired to persistent object storage in this pass —
      // we record the filename so the submission is real, not silently dropped.
      responses[field.id] = file instanceof File && file.size > 0 ? file.name : ''
    } else {
      const value = (formData.get(field.id) as string | null)?.trim() ?? ''
      if (field.required && !value) {
        return { status: 'error', message: `${field.label} is required.` }
      }
      responses[field.id] = value
    }
  }

  const email = String(responses.email ?? '').toLowerCase()
  const fullName = String(responses.fullName ?? '').trim()

  if (!email) {
    return { status: 'error', message: 'An email address is required to register.' }
  }

  let person = await prisma.person.findUnique({ where: { email } })

  if (!person) {
    const [firstName, ...rest] = fullName.split(' ').filter(Boolean)
    const lastName = rest.join(' ') || '—'
    const pillarValue = typeof responses.pillar === 'string' ? PILLAR_MAP[responses.pillar] : undefined

    person = await prisma.person.create({
      data: {
        firstName: firstName || fullName || 'Guest',
        lastName,
        slug: slugify(`${firstName || 'guest'}-${lastName}-${Date.now().toString(36)}`),
        email,
        phone: typeof responses.phone === 'string' ? responses.phone : undefined,
        country: typeof responses.country === 'string' ? responses.country : undefined,
        pillarTags: pillarValue ? [pillarValue] : [],
      },
    })
  }

  await prisma.registration.create({
    data: {
      eventId: event.id,
      formId: event.registrationForm.id,
      personId: person.id,
      responses,
      status: 'REGISTERED',
    },
  })

  if (event.registrationForm.confirmationType === 'REDIRECT' && event.registrationForm.redirectUrl) {
    // Revalidating the page we're about to leave is safe here since this
    // response is a redirect, not a same-page re-render bundled with the
    // action's return value (see the note below on why that combination is
    // avoided for the non-redirect path).
    revalidatePath(`/events/${eventSlug}`)
    redirect(event.registrationForm.redirectUrl)
  }

  // Deliberately no revalidatePath call here: this action is invoked via
  // useActionState and the visitor stays on this same event page, so Next
  // already re-renders it fresh as part of returning the action's result.
  // Calling revalidatePath for the *same* path in that combination causes
  // the response to hang indefinitely in this Next 16 + Turbopack setup
  // (reproduced: DB write completes immediately, HTTP response never
  // returns). Nothing on this page depends on registration counts, so
  // skipping revalidation here has no visible effect anyway.
  return {
    status: 'success',
    message: event.registrationForm.confirmationMessage ?? 'You are registered.',
  }
}
