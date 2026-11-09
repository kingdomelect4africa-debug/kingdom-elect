import { EmailLayout, EmailHeading, EmailText, EmailButton, EmailDivider, EmailFieldRow, colors, SITE_URL } from './EmailLayout'
import type { AccessTier } from '@/lib/situation-room-tiers'

export function SituationRoomTierConfirmationEmail({
  tier,
  firstName,
  confirmationMessage,
  answers,
}: {
  tier: AccessTier
  firstName: string
  confirmationMessage: string
  answers: { label: string; value: string }[]
}) {
  return (
    <EmailLayout preview={`Your ${tier} registration for the Situation Room has been received.`}>
      <span style={{ fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>
        {tier} &middot; Africa Situation Room &middot; Abuja &middot; Dec 26–29, 2026
      </span>
      <EmailHeading>Thank you, {firstName}.</EmailHeading>
      <EmailText>
        We have received your {tier} registration for the Kingdom E.L.E.C.T. for Africa Situation Room. {confirmationMessage}
      </EmailText>
      <EmailText style={{ fontStyle: 'italic', color: colors.navy }}>
        This is not a conference. It is a governance chamber. Looking forward to seeing you in the Situation Room.
      </EmailText>

      <EmailDivider />

      {answers.map((answer, index) => (
        <EmailFieldRow key={index} label={answer.label} value={answer.value} />
      ))}

      <EmailDivider />

      <EmailButton href={`${SITE_URL}/the-situation-room`}>View The Situation Room</EmailButton>

      <EmailText style={{ fontSize: 13, color: colors.navy }}>
        Questions in the meantime? Reply to this email or write to{' '}
        <a href="mailto:support@kingdomelect4africa.online" style={{ color: colors.navy }}>
          support@kingdomelect4africa.online
        </a>
        .
      </EmailText>
    </EmailLayout>
  )
}

export default SituationRoomTierConfirmationEmail
