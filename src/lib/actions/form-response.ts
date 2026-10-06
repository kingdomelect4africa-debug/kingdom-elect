'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { readResponses, contactDetails, findOrCreatePerson } from '@/lib/form-submission'
import type { FormFieldConfig } from '@/lib/forms'

export type FormResponseActionState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

/** Submissions through a form's public link while it isn't attached to anything. */
export async function submitFormResponse(
  _prevState: FormResponseActionState,
  formData: FormData,
): Promise<FormResponseActionState> {
  // formSlug travels as a hidden field — see the note in submitRegistration
  // on why these useActionState actions avoid `.bind()`.
  const formSlug = (formData.get('formSlug') as string | null) ?? ''

  const form = await prisma.formDefinition.findUnique({
    where: { slug: formSlug },
    include: { _count: { select: { events: true, programs: true } } },
  })

  if (!form) return { status: 'error', message: 'This form could not be found.' }
  // Once attached, the link hands off to the event/program flow, which
  // enforces that event's or program's open/closed status — don't let a stale
  // page bypass that by posting here.
  if (form._count.events > 0 || form._count.programs > 0) {
    return { status: 'error', message: 'This form has moved to an event or program. Please reload the page.' }
  }

  const fields = form.fields as unknown as FormFieldConfig[]
  const parsed = readResponses(fields, formData)
  if (!parsed.ok) return { status: 'error', message: parsed.message }
  const { responses } = parsed

  // An email isn't required here (a form may be an anonymous survey), but
  // when there is one the response is tied to that Person like everything else.
  const contact = contactDetails(fields, responses)
  const person = contact.email ? await findOrCreatePerson(contact) : null

  await prisma.formSubmission.create({
    data: { formId: form.id, personId: person?.id, responses },
  })

  if (form.confirmationType === 'REDIRECT' && form.redirectUrl) {
    revalidatePath(`/forms/${formSlug}`)
    redirect(form.redirectUrl)
  }

  // No revalidatePath on the same-page path — see the note in submitRegistration.
  return {
    status: 'success',
    message: form.confirmationMessage ?? 'Thank you — your response has been received.',
  }
}
