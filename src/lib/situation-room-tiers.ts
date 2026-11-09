import { INDUSTRY_OPTIONS, PHONE_COUNTRY_CODES } from '@/components/marketing/situation-room/register/steps'

/**
 * Questions and rules shared by the VVIP and VIP Situation Room forms.
 * Used in the browser and in the server action, so it stays free of
 * server-only imports.
 */

export type AccessTier = 'VVIP' | 'VIP'
export const ACCESS_TIERS: AccessTier[] = ['VVIP', 'VIP']

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

/** Accommodation, and the spouse question that follows it, are VIP only. */
export function asksAccommodation(tier: AccessTier): boolean {
  return tier === 'VIP'
}

export const SECTOR_OPTIONS = INDUSTRY_OPTIONS
export const GENDER_OPTIONS = ['Male', 'Female']
export const YES_NO_OPTIONS = ['Yes', 'No']

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

export const TIER_QUESTIONS = {
  full_name: 'Name',
  email: 'Email',
  phone_number: 'Contact number',
  gender: 'Gender',
  sector: 'Sector',
  sector_other: 'Please specify your sector',
  business_niche: 'Business niche',
  needs_accommodation: 'Will you be needing accommodation?',
  spouse_attending: 'Will you be coming with your spouse?',
  willing_to_partner: 'Are you willing to partner with or give towards the Situation Room?',
}

/**
 * Each form's questions in the order its page shows them, for the read-only
 * view in the admin Form Builder. Keep in step with the two form components.
 */
export function tierQuestionList(tier: AccessTier): { label: string; answers: string }[] {
  const Q = TIER_QUESTIONS
  return [
    { label: Q.full_name, answers: 'Text' },
    { label: Q.email, answers: 'Email address' },
    { label: Q.phone_number, answers: 'Country code and number' },
    { label: Q.gender, answers: GENDER_OPTIONS.join(' / ') },
    { label: Q.sector, answers: `One of ${SECTOR_OPTIONS.length} sectors, the same list as the main registration form. "Other" asks them to specify.` },
    { label: Q.business_niche, answers: 'Text' },
    ...(asksAccommodation(tier)
      ? [
          { label: Q.needs_accommodation, answers: YES_NO_OPTIONS.join(' / ') },
          { label: Q.spouse_attending, answers: YES_NO_OPTIONS.join(' / ') },
        ]
      : []),
    { label: Q.willing_to_partner, answers: YES_NO_OPTIONS.join(' / ') },
  ]
}

export type TierAnswers = {
  full_name: string
  email: string
  phone_country: string
  phone_number: string
  gender: string
  sector: string
  sector_other: string
  business_niche: string
  needs_accommodation: string
  spouse_attending: string
  willing_to_partner: string
}

export type TierErrors = Partial<Record<keyof TierAnswers, string>>

export const EMPTY_TIER_ANSWERS: TierAnswers = {
  full_name: '',
  email: '',
  phone_country: PHONE_COUNTRY_CODES[0],
  phone_number: '',
  gender: '',
  sector: '',
  sector_other: '',
  business_niche: '',
  needs_accommodation: '',
  spouse_attending: '',
  willing_to_partner: '',
}

/** Top-to-bottom order, used to move focus to the first unanswered question. */
export const TIER_FIELD_ORDER: (keyof TierAnswers)[] = [
  'full_name',
  'email',
  'phone_number',
  'gender',
  'sector',
  'sector_other',
  'business_niche',
  'needs_accommodation',
  'spouse_attending',
  'willing_to_partner',
]

const MAX_LENGTH: Partial<Record<keyof TierAnswers, number>> = {
  full_name: 120,
  email: 254,
  phone_number: 24,
  sector_other: 80,
  business_niche: 160,
}

/** Keeps only known fields as trimmed, length-limited strings. Server actions accept any input. */
export function cleanTierAnswers(raw: unknown): TierAnswers {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const clean = { ...EMPTY_TIER_ANSWERS }
  for (const key of Object.keys(clean) as (keyof TierAnswers)[]) {
    const value = source[key]
    clean[key] = typeof value === 'string' ? value.trim().slice(0, MAX_LENGTH[key] ?? 40) : ''
  }
  clean.email = clean.email.toLowerCase()
  return clean
}

export function validateTierAnswers(answers: TierAnswers, tier: AccessTier): TierErrors {
  const errors: TierErrors = {}
  const filled = (value: string) => value.trim().length > 0

  if (!filled(answers.full_name)) errors.full_name = 'Please enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(answers.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!PHONE_COUNTRY_CODES.includes(answers.phone_country) || answers.phone_number.replace(/\D/g, '').length < 7) {
    errors.phone_number = 'Please enter your contact number.'
  }
  if (!GENDER_OPTIONS.includes(answers.gender)) errors.gender = 'Please select your gender.'
  if (!SECTOR_OPTIONS.includes(answers.sector)) errors.sector = 'Please select your sector.'
  if (answers.sector === 'Other' && !filled(answers.sector_other)) errors.sector_other = 'Please tell us your sector.'
  if (!filled(answers.business_niche)) errors.business_niche = 'Please enter your business niche.'
  if (asksAccommodation(tier)) {
    if (!YES_NO_OPTIONS.includes(answers.needs_accommodation)) errors.needs_accommodation = 'Please choose Yes or No.'
    if (!YES_NO_OPTIONS.includes(answers.spouse_attending)) errors.spouse_attending = 'Please choose Yes or No.'
  }
  if (!YES_NO_OPTIONS.includes(answers.willing_to_partner)) errors.willing_to_partner = 'Please choose Yes or No.'
  return errors
}

export function displaySector(answers: TierAnswers): string {
  return answers.sector === 'Other' ? answers.sector_other.trim() || 'Other' : answers.sector
}
