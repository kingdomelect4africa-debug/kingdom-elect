import { EmailLayout, EmailHeading, EmailText, EmailButton, EmailDivider, EmailFieldRow, colors, SITE_URL } from './EmailLayout'
import type { AccessTier } from '@/lib/situation-room-tiers'

export function SituationRoomTierAdminNotificationEmail({
  tier,
  registrationId,
  fullName,
  email,
  contactNumber,
  gender,
  sector,
  businessNiche,
  needsAccommodation,
  spouseAttending,
  willingToPartner,
}: {
  tier: AccessTier
  registrationId: string
  fullName: string
  email: string
  contactNumber: string
  gender: string
  sector: string
  businessNiche: string
  needsAccommodation?: string
  spouseAttending?: string
  willingToPartner: string
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

      <EmailFieldRow label="Email" value={email} />
      <EmailFieldRow label="Contact number" value={contactNumber} />
      <EmailFieldRow label="Gender" value={gender} />
      <EmailFieldRow label="Sector" value={sector} />
      <EmailFieldRow label="Business niche" value={businessNiche} />
      {needsAccommodation && <EmailFieldRow label="Accommodation needed" value={needsAccommodation} />}
      {spouseAttending && <EmailFieldRow label="Coming with spouse" value={spouseAttending} />}
      <EmailFieldRow label="Willing to partner or give" value={willingToPartner} />
    </EmailLayout>
  )
}

export default SituationRoomTierAdminNotificationEmail
