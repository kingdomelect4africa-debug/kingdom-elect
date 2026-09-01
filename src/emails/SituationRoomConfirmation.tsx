import { EmailLayout, EmailHeading, EmailText, EmailButton, EmailDivider, colors, SITE_URL } from './EmailLayout'

export function SituationRoomConfirmationEmail({
  firstName,
  invitationRequested,
  commitFullParticipation,
  accommodationSubscribe,
}: {
  firstName: string
  invitationRequested: string
  commitFullParticipation: string
  accommodationSubscribe: string
}) {
  const requestedInvitation = invitationRequested === 'Yes, request my invitation'

  return (
    <EmailLayout preview="Your Situation Room registration has been received.">
      <span style={{ fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>
        Africa Situation Room &middot; Abuja &middot; Dec 26&ndash;29, 2026
      </span>
      <EmailHeading>You&rsquo;re in the queue, {firstName}.</EmailHeading>
      <EmailText style={{ fontStyle: 'italic', color: colors.navy }}>
        This is not a conference. It is a governance chamber. Looking forward to seeing you in the Situation Room.
      </EmailText>
      <EmailText>
        Thank you for registering your interest in Kingdom E.L.E.C.T. for Africa&rsquo;s Situation Room. We&rsquo;ve
        recorded your responses and our team reviews every submission individually.
      </EmailText>

      <EmailDivider />

      <EmailText style={{ marginBottom: 4 }}>
        <strong>Full participation:</strong> {commitFullParticipation}
      </EmailText>
      <EmailText style={{ marginBottom: 4 }}>
        <strong>Accommodation:</strong> {accommodationSubscribe}
      </EmailText>
      <EmailText style={{ marginBottom: 0 }}>
        <strong>Invitation request:</strong> {invitationRequested}
      </EmailText>

      <EmailDivider />

      <EmailText>
        {requestedInvitation
          ? 'Your invitation request has been received. Selected participants will be contacted directly ahead of the gathering.'
          : 'You can request a formal invitation letter any time once you are certain of attending — just reply to this email or reach our team via WhatsApp.'}
      </EmailText>

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

export default SituationRoomConfirmationEmail
