import { INDUSTRY_OPTIONS } from '@/components/marketing/situation-room/register/steps'
import type { FormFieldConfig } from '@/lib/forms'

/**
 * Fixed parts of the VVIP and VIP Situation Room pages. Their questions live in
 * the Form Builder (a FormDefinition per tier); this file only holds the page
 * design copy and the questions each form starts with. Used in the browser
 * too, so it stays free of server-only imports.
 */

export type AccessTier = 'VVIP' | 'VIP'
export const ACCESS_TIERS: AccessTier[] = ['VVIP', 'VIP']

export function isAccessTier(value: unknown): value is AccessTier {
  return ACCESS_TIERS.includes(value as AccessTier)
}

/** Both forms register people for this event. */
export const TIER_EVENT_SLUG = 'the-situation-room-2026'

/** Where each form lives on the public site. */
export const TIER_PATHS: Record<AccessTier, string> = {
  VVIP: '/the-situation-room/vvip',
  VIP: '/the-situation-room/vip',
}

export function tierFormName(tier: AccessTier): string {
  return `${tier} Registration — The Situation Room`
}

export const TIER_CONFIRMATION_MESSAGE = 'Our team will contact you directly with the next steps.'

/** The same introduction as the main registration form. */
export const SITUATION_ROOM_INTRO = {
  organization: 'Kingdom E.L.E.C.T. for Africa',
  title: 'Africa Situation Room',
  when: 'Abuja · December 26–29, 2026',
  body: 'Africa stands at the intersection of prophecy, potential, and paradox. This is a governance chamber — a strategic convergence of Kingdom-minded thinkers, builders, innovators and reformers committed to advancing God’s purpose for Africa through influence, excellence and transformational leadership.',
  closing: 'This is not a conference. It is a governance chamber.',
}

const SHARED_FACTS = ['Abuja', 'Dec 26–29, 2026', 'Free event, donations welcome']

export const TIER_FACTS: Record<AccessTier, string[]> = {
  VVIP: SHARED_FACTS,
  VIP: [...SHARED_FACTS, 'Shared accommodation for 80'],
}

/**
 * The questions each form starts with, the first time its FormDefinition is
 * created. From then on the Form Builder owns them. The ids match the keys the
 * first VVIP and VIP registrations were saved under, so old and new ones read
 * the same in the admin.
 */
export function defaultTierFields(tier: AccessTier): FormFieldConfig[] {
  const yesNo = ['Yes', 'No']
  const accommodation: FormFieldConfig[] =
    tier === 'VIP'
      ? [{ id: 'needs_accommodation', type: 'radio', label: 'Will you be needing accommodation?', required: true, options: yesNo }]
      : []

  return [
    { id: 'full_name', type: 'text', label: 'Name', required: true },
    { id: 'email', type: 'email', label: 'Email', required: true },
    { id: 'contact_number', type: 'phone', label: 'Contact number', required: true },
    { id: 'residence', type: 'text', label: 'Current place of residence', required: true },
    { id: 'gender', type: 'radio', label: 'Gender', required: true, options: ['Male', 'Female'] },
    { id: 'sector', type: 'dropdown', label: 'Sector', required: true, options: [...INDUSTRY_OPTIONS], specifyOther: true },
    { id: 'business_niche', type: 'text', label: 'Business niche', required: true },
    { id: 'attendance_mode', type: 'radio', label: 'Will you be attending online or offline?', required: true, options: ['Online', 'Offline'] },
    ...accommodation,
    { id: 'spouse_attending', type: 'radio', label: 'Will you be coming with your spouse?', required: true, options: yesNo },
    {
      id: 'willing_to_partner',
      type: 'radio',
      label: 'Are you willing to partner with or give towards the Situation Room?',
      required: true,
      options: yesNo,
    },
  ]
}
