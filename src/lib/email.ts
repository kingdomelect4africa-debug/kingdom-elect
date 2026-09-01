import { Resend } from 'resend'
import { SituationRoomConfirmationEmail } from '@/emails/SituationRoomConfirmation'
import { SituationRoomAdminNotificationEmail } from '@/emails/SituationRoomAdminNotification'
import type { Answers } from '@/components/marketing/situation-room/register/steps'

const FROM = 'Kingdom E.L.E.C.T. for Africa <registrations@kingdomelect4africa.online>'
const ADMIN_NOTIFICATION_EMAIL = 'kingdomelect4africa@gmail.com'

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
