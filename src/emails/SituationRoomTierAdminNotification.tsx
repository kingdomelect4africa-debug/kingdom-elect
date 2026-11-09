import { EmailLayout, EmailHeading, EmailText, EmailButton, EmailDivider, EmailFieldRow, colors, SITE_URL } from './EmailLayout'
import type { AccessTier } from '@/lib/situation-room-tiers'

export function SituationRoomTierAdminNotificationEmail({
  tier,
  registrationId,
  fullName,
  answers,
}: {
  tier: AccessTier
  registrationId: string
  fullName: string
  answers: { label: string; value: string }[]
}) {
  return (
    <EmailLayout preview={`New ${tier} registration: ${fullName}`}>
      <span style={{ fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>
        New {tier} Registration
      </span>
      <EmailHeading>{fullName}</EmailHeading>
      <EmailText>A new {tier} registration for the Situation Room just came in.</EmailText>

      <EmailButton href={`${SITE_URL}/admin/registrations/${registrationId}`}>View Registration</EmailButton>

      <EmailDivider />

      {answers.map((answer, index) => (
        <EmailFieldRow key={index} label={answer.label} value={answer.value} />
      ))}
    </EmailLayout>
  )
}

export default SituationRoomTierAdminNotificationEmail
