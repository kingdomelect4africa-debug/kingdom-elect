'use server'

import { prisma } from '@/lib/db'
import { sendSituationRoomTierEmails } from '@/lib/email'
import { contactDetails, findOrCreatePerson, isValidEmail } from '@/lib/form-submission'
import { checkAnswers, type AnswerValue } from '@/lib/forms'
import { getTierForm, tierPageFields } from '@/lib/tier-forms'
import { TIER_CONFIRMATION_MESSAGE, TIER_EVENT_SLUG, isAccessTier, type AccessTier } from '@/lib/situation-room-tiers'

export type TierSubmitResult =
  | { success: true; redirectUrl?: string }
  | { success: false; message: string; errors?: Record<string, string> }

function displayAnswer(value: AnswerValue | undefined): string {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  return value ?? ''
}

export async function submitSituationRoomTierRegistration(tier: AccessTier, raw: unknown): Promise<TierSubmitResult> {
  if (!isAccessTier(tier)) return { success: false, message: 'This registration link is not valid.' }

  // Checked against the questions as they are now, not as the page had them.
  const form = await getTierForm(tier)
  const fields = tierPageFields(form)
  const { errors, responses } = checkAnswers(fields, raw)
  if (Object.keys(errors).length > 0) return { success: false, message: 'Please check the highlighted answers.', errors }

  const contact = contactDetails(fields, responses)
  if (!contact.email) return { success: false, message: 'An email address is required to register.' }
  if (!isValidEmail(contact.email)) return { success: false, message: 'Please enter a valid email address.' }

  const event = await prisma.event.findUnique({ where: { slug: TIER_EVENT_SLUG } })
  if (!event) return { success: false, message: 'This event could not be found. Please contact the organizing team.' }
  if (event.registrationStatus === 'CLOSED') return { success: false, message: 'Registration for this event is closed.' }

  // This form is public, so it never overwrites details on an existing person.
  // What they typed is kept on the registration itself.
  const person = await findOrCreatePerson(contact)
  if (!person.phone && contact.phone) {
    await prisma.person.update({ where: { id: person.id }, data: { phone: contact.phone } })
  }

  const registration = await prisma.registration.create({
    data: {
      eventId: event.id,
      personId: person.id,
      formId: form.id,
      status: 'REGISTERED',
      responses: { ...responses, access_tier: tier, submitted_at: new Date().toISOString() },
    },
  })

  const confirmationMessage = form.confirmationMessage?.trim() || TIER_CONFIRMATION_MESSAGE
  await sendSituationRoomTierEmails(tier, {
    registrationId: registration.id,
    fullName: contact.fullName || contact.email,
    email: contact.email,
    answers: fields.map((field) => ({ label: field.label, value: displayAnswer(responses[field.id]) })),
    confirmationMessage,
    notify: form.notificationEmails,
  })

  return {
    success: true,
    redirectUrl: form.confirmationType === 'REDIRECT' && form.redirectUrl ? form.redirectUrl : undefined,
  }
}
