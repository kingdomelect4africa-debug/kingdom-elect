import { Resend } from 'resend'
import { SituationRoomConfirmationEmail } from '@/emails/SituationRoomConfirmation'
import { SituationRoomAdminNotificationEmail } from '@/emails/SituationRoomAdminNotification'
import type { Answers } from '@/components/marketing/situation-room/register/steps'
import { SituationRoomTierConfirmationEmail } from '@/emails/SituationRoomTierConfirmation'
import { SituationRoomTierAdminNotificationEmail } from '@/emails/SituationRoomTierAdminNotification'
import type { AccessTier } from '@/lib/situation-room-tiers'

const FROM = 'Kingdom E.L.E.C.T. for Africa <registrations@kingdomelect4africa.online>'
export const ADMIN_NOTIFICATION_EMAIL = 'kingdomelect4africa@gmail.com'

let cachedClient: Resend | null = null

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (!cachedClient) cachedClient = new Resend(apiKey)
  return cachedClient
}

/**
 * Sends both the registrant confirmation and the admin notification for a
 * Situation Room registration. Best-effort: email delivery failures are
 * logged, never thrown — the Registration row is already the source of
 * truth by the time this runs, so a mail provider hiccup shouldn't fail
 * the registration itself.
 */
export async function sendSituationRoomEmails(answers: Answers, registrationId: string): Promise<void> {
  const resend = getResendClient()
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping Situation Room registration emails.')
    return
  }

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: answers.email,
      replyTo: 'support@kingdomelect4africa.online',
      subject: "You're in the queue — Kingdom E.L.E.C.T. Situation Room",
      react: SituationRoomConfirmationEmail({
        firstName: answers.full_name.split(' ')[0] || answers.full_name,
        invitationRequested: answers.invitation_requested,
        commitFullParticipation: answers.commit_full_participation,
        accommodationSubscribe: answers.accommodation_subscribe,
      }),
    }),
    resend.emails.send({
      from: FROM,
      to: ADMIN_NOTIFICATION_EMAIL,
      replyTo: answers.email,
      subject: `New Situation Room registration — ${answers.full_name}`,
      react: SituationRoomAdminNotificationEmail({ answers, registrationId }),
    }),
  ])

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('Situation Room registration email failed to send:', result.reason)
    }
  }
}

/**
 * Same best-effort rules as sendSituationRoomEmails, for the VVIP and VIP
 * forms. The Registration row is already saved when this runs. Their questions
 * are edited in the Form Builder, so both emails list whatever was asked.
 */
export async function sendSituationRoomTierEmails(
  tier: AccessTier,
  details: {
    registrationId: string
    fullName: string
    email: string
    answers: { label: string; value: string }[]
    confirmationMessage: string
    /** The form's notification emails; the admin inbox if it has none. */
    notify: string[]
  },
): Promise<void> {
  const resend = getResendClient()
  if (!resend) {
    console.warn(`RESEND_API_KEY not set, skipping ${tier} registration emails.`)
    return
  }

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: details.email,
      replyTo: 'support@kingdomelect4africa.online',
      subject: `Your ${tier} registration: Kingdom E.L.E.C.T. Situation Room`,
      react: SituationRoomTierConfirmationEmail({
        tier,
        firstName: details.fullName.split(' ')[0] || details.fullName,
        confirmationMessage: details.confirmationMessage,
        answers: details.answers,
      }),
    }),
    resend.emails.send({
      from: FROM,
      to: details.notify.length > 0 ? details.notify : ADMIN_NOTIFICATION_EMAIL,
      replyTo: details.email,
      subject: `New ${tier} registration: ${details.fullName}`,
      react: SituationRoomTierAdminNotificationEmail({
        tier,
        registrationId: details.registrationId,
        fullName: details.fullName,
        answers: details.answers,
      }),
    }),
  ])

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error(`${tier} registration email failed to send:`, result.reason)
    } else if (result.value.error) {
      console.error(`${tier} registration email was refused:`, result.value.error)
    }
  }
}
