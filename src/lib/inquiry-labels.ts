import type { InquiryType } from '@prisma/client'

// Mirrors the option labels used on the public contact and get-involved forms
// (see src/app/(marketing)/contact/page.tsx and .../get-involved/page.tsx).
export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  CONTACT_GENERAL: 'Contact — General Enquiry',
  CONTACT_PARTNERSHIP: 'Contact — Partnership',
  CONTACT_MEDIA: 'Contact — Media',
  CONTACT_SPEAKING: 'Contact — Speaking',
  CONTACT_INTELLIGENCE: 'Contact — Kingdom Intelligence',
  CONTACT_EVENTS: 'Contact — Events',
  CONTACT_OTHER: 'Contact — Other',
  GET_INVOLVED_JOIN_COMMUNITY: 'Get Involved — Join the Community',
  GET_INVOLVED_BECOME_FELLOW: 'Get Involved — Become a Fellow',
  GET_INVOLVED_PARTNER: 'Get Involved — Partner With Us',
  GET_INVOLVED_VOLUNTEER: 'Get Involved — Volunteer',
  GET_INVOLVED_ATTEND_EVENT: 'Get Involved — Attend an Event',
  GET_INVOLVED_SUBMIT_IDEA: 'Get Involved — Submit an Idea',
  GET_INVOLVED_SUPPORT_WORK: 'Get Involved — Support the Work',
  GET_INVOLVED_INSTITUTIONAL_PARTNER: 'Get Involved — Become an Institutional Partner',
}
