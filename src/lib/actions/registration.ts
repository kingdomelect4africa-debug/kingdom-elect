'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { readResponses, contactDetails, findOrCreatePerson } from '@/lib/form-submission'
import type { FormFieldConfig } from '@/lib/forms'

export type RegistrationActionState = {
  status: 'idle' | 'success' | 'error'
  message: string
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
  const parsed = readResponses(fields, formData)
  if (!parsed.ok) return { status: 'error', message: parsed.message }
  const { responses } = parsed

  const contact = contactDetails(fields, responses)
  if (!contact.email) {
    return { status: 'error', message: 'An email address is required to register.' }
  }

  const person = await findOrCreatePerson(contact)

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
