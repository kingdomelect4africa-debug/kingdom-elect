import { EmailLayout, EmailHeading, EmailText, EmailButton, EmailDivider, EmailFieldRow, colors, SITE_URL } from './EmailLayout'
import type { Answers } from '@/components/marketing/situation-room/register/steps'

export function SituationRoomAdminNotificationEmail({ answers, registrationId }: { answers: Answers; registrationId: string }) {
  return (
    <EmailLayout preview={`New Situation Room registration — ${answers.full_name}`}>
      <span style={{ fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>
        New Registration
      </span>
      <EmailHeading>{answers.full_name}</EmailHeading>
      <EmailText>A new Situation Room registration just came in. Key details below — full responses are in the admin panel.</EmailText>

      <EmailButton href={`${SITE_URL}/admin/registrations/${registrationId}`}>View Full Registration</EmailButton>

      <EmailDivider />

      <EmailFieldRow label="Email" value={answers.email} />
      <EmailFieldRow label="Phone (WhatsApp)" value={`${answers.phone_country} ${answers.phone_number}`} />
      <EmailFieldRow label="City" value={answers.city_of_residence} />
      <EmailFieldRow label="Occupation / Role" value={answers.occupation_role} />
      <EmailFieldRow label="Organization" value={answers.organization_name} />
      <EmailFieldRow label="Industry" value={answers.industry_sector === 'Other' ? answers.industry_sector_other : answers.industry_sector} />
      <EmailFieldRow label="Experience" value={answers.years_experience} />
      <EmailFieldRow label="Abuja Influence" value={answers.abuja_influence} />
      <EmailFieldRow label="Self-Identification" value={answers.self_identification.join(', ')} />
      <EmailFieldRow label="Full Participation" value={answers.commit_full_participation} />
      <EmailFieldRow label="Accommodation" value={answers.accommodation_subscribe} />
      <EmailFieldRow label="Spouse Attending" value={answers.spouse_attending} />
      <EmailFieldRow label="Invitation Requested" value={answers.invitation_requested} />
      <EmailFieldRow label="Donation Interest" value={answers.donation_interest} />
      <EmailFieldRow label="Donation Pledge" value={answers.donation_pledge} />

      <EmailDivider />

      <EmailText style={{ fontWeight: 700, marginBottom: 4 }}>Kingdom understanding &amp; stewardship</EmailText>
      <EmailText>{answers.kingdom_understanding}</EmailText>

      <EmailText style={{ fontWeight: 700, marginBottom: 4 }}>Motivation</EmailText>
      <EmailText>{answers.motivation}</EmailText>

      <EmailText style={{ fontWeight: 700, marginBottom: 4 }}>Value offered</EmailText>
      <EmailText>{answers.value_offered}</EmailText>

      {answers.networks_boards && (
        <>
          <EmailText style={{ fontWeight: 700, marginBottom: 4 }}>Networks / boards</EmailText>
          <EmailText>{answers.networks_boards}</EmailText>
        </>
      )}
    </EmailLayout>
  )
}

export default SituationRoomAdminNotificationEmail
