export type Answers = {
  email: string
  full_name: string
  phone_country: string
  phone_number: string
  city_of_residence: string
  occupation_role: string
  organization_name: string
  industry_sector: string
  industry_sector_other: string
  years_experience: string
  kingdom_understanding: string
  motivation: string
  value_offered: string
  abuja_influence: string
  self_identification: string[]
  self_identification_other: string
  networks_boards: string
  commit_full_participation: string
  accommodation_subscribe: string
  spouse_attending: string
  access_protocol_agreed: boolean
  invitation_requested: string
  donation_interest: string
  donation_pledge: string
}

export const EMPTY_ANSWERS: Answers = {
  email: '',
  full_name: '',
  phone_country: '+234',
  phone_number: '',
  city_of_residence: '',
  occupation_role: '',
  organization_name: '',
  industry_sector: '',
  industry_sector_other: '',
  years_experience: '',
  kingdom_understanding: '',
  motivation: '',
  value_offered: '',
  abuja_influence: '',
  self_identification: [],
  self_identification_other: '',
  networks_boards: '',
  commit_full_participation: '',
  accommodation_subscribe: '',
  spouse_attending: '',
  access_protocol_agreed: false,
  invitation_requested: '',
  donation_interest: '',
  donation_pledge: '',
}

export type StepType =
  | 'intro'
  | 'email'
  | 'text'
  | 'phone'
  | 'select'
  | 'choice'
  | 'textarea'
  | 'multichoice'
  | 'protocol'
  | 'donation'
  | 'outro'

export type Step = {
  id: keyof Answers | 'welcome' | 'protocol' | 'confirmation'
  type: StepType
  section?: string
  question?: string
  helper?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  options?: string[]
  optional?: boolean
  condition?: (answers: Answers) => boolean
}

export const INDUSTRY_OPTIONS = [
  'Finance',
  'Creative Arts',
  'Real Estate',
  'Technology',
  'Energy',
  'Government',
  'Ministry',
  'Healthcare',
  'Education',
  'Agriculture',
  'Law',
  'Media',
  'Other',
]

export const EXPERIENCE_OPTIONS = ['0–2 years', '3–5 years', '6–10 years', '11–20 years', '20+ years']

export const SELF_IDENTIFICATION_OPTIONS = [
  'Kingdom Wealth Steward',
  'Five-fold Leader',
  'Proven Entrepreneur',
  'Educator / Curriculum Disruptor',
  'Senior Professional & Strategic Leader',
  'Emerging Leader (across spheres/sectors)',
  'Youth Leader / Professional',
  'Other',
]

export const STEPS: Step[] = [
  { id: 'welcome', type: 'intro' },
  { id: 'email', type: 'email', question: "What's your email address?", helper: "We'll use this to follow up on your registration.", required: true },
  { id: 'full_name', type: 'text', section: 'Personal Information', question: 'What is your full name?', required: true },
  {
    id: 'phone_number',
    type: 'phone',
    section: 'Personal Information',
    question: 'Phone number (WhatsApp enabled)',
    helper: 'Please ensure this number is active on WhatsApp — this is our primary channel for updates.',
    required: true,
  },
  { id: 'city_of_residence', type: 'text', section: 'Personal Information', question: 'What city do you currently reside in?', required: true },
  {
    id: 'occupation_role',
    type: 'text',
    section: 'Professional & Economic Profile',
    question: 'What is your primary occupation or role?',
    placeholder: 'e.g., Entrepreneur, Educator, Executive, Five-fold leader, Consultant',
    required: true,
  },
  {
    id: 'organization_name',
    type: 'text',
    section: 'Professional & Economic Profile',
    question: 'What is the name of your organization or business?',
    required: true,
  },
  {
    id: 'industry_sector',
    type: 'select',
    section: 'Professional & Economic Profile',
    question: 'What industry or sector do you operate in?',
    options: INDUSTRY_OPTIONS,
    required: true,
  },
  {
    id: 'years_experience',
    type: 'choice',
    section: 'Professional & Economic Profile',
    question: 'How many years of professional or business experience do you have?',
    options: EXPERIENCE_OPTIONS,
    required: true,
  },
  {
    id: 'kingdom_understanding',
    type: 'textarea',
    section: 'Kingdom Alignment & Strategic Positioning',
    question: 'How would you describe your understanding of Kingdom and stewardship of resources for kingdom advancement?',
    maxLength: 300,
    required: true,
  },
  {
    id: 'motivation',
    type: 'textarea',
    section: 'Kingdom Alignment & Strategic Positioning',
    question: 'Why are you interested in participating in this Situation Room?',
    helper: 'This is a key selection question — be thoughtful and concise.',
    maxLength: 400,
    required: true,
  },
  {
    id: 'value_offered',
    type: 'textarea',
    section: 'Kingdom Alignment & Strategic Positioning',
    question: 'What specific value or perspective do you bring to a high-level strategic gathering like this?',
    maxLength: 400,
    required: true,
  },
  {
    id: 'abuja_influence',
    type: 'choice',
    section: 'Kingdom Alignment & Strategic Positioning',
    question: 'Do you currently operate or have influence within Abuja?',
    options: ['Yes', 'No', 'Somewhat'],
    required: true,
  },
  {
    id: 'self_identification',
    type: 'multichoice',
    section: 'Kingdom Alignment & Strategic Positioning',
    question: 'Which of the following best describes you?',
    helper: 'Select all that apply.',
    options: SELF_IDENTIFICATION_OPTIONS,
    required: true,
  },
  {
    id: 'networks_boards',
    type: 'textarea',
    section: 'Kingdom Alignment & Strategic Positioning',
    question: 'Are you currently part of any strategic or high-level networks, boards, or councils on Kingdom stewardship?',
    maxLength: 400,
    optional: true,
  },
  {
    id: 'commit_full_participation',
    type: 'choice',
    section: 'Availability & Commitment',
    question:
      'This is a high-level strategic gathering limited to 200 participants. Are you willing to commit to full participation if invited? (December 26th–29th)',
    options: ['Yes, I can commit to all 4 days', 'No', 'Not certain yet'],
    required: true,
  },
  {
    id: 'accommodation_subscribe',
    type: 'choice',
    section: 'Availability & Commitment',
    question: 'Will you be subscribing to our accommodation arrangement?',
    helper:
      'Comfortable shared accommodation is available for 80 persons, allocated first-come-first-served, with priority given to delegates not resident in Abuja.',
    options: ['Yes', 'No'],
    required: true,
  },
  {
    id: 'spouse_attending',
    type: 'choice',
    section: 'Availability & Commitment',
    question: 'Are you married and will you be attending with your spouse?',
    options: ['Yes', 'No', 'Not married'],
    required: true,
    condition: (a) => a.accommodation_subscribe === 'Yes',
  },
  { id: 'protocol', type: 'protocol', section: 'Availability & Commitment', question: 'Please confirm your understanding of the access process.', required: true },
  {
    id: 'invitation_requested',
    type: 'choice',
    section: 'Availability & Commitment',
    question: 'Do you want to formally request an invitation letter for the Kingdom E.L.E.C.T for Africa (Abuja Situation Room)?',
    helper:
      'Requesting an invitation letter means you are certain of attending and are asking us to secure a seat for you. Selection is on a first-come basis after criteria are met.',
    options: ['Yes, request my invitation', 'Not yet — registering interest only'],
    required: true,
  },
  {
    id: 'donation_interest',
    type: 'donation',
    section: 'Availability & Commitment',
    question: 'Would you like to donate financially to support the Situation Room?',
    helper: 'Participation is free and covers curated sessions with seasoned facilitators, networking, meals, and shared accommodation.',
    options: ['Yes', 'No'],
    required: true,
  },
  { id: 'confirmation', type: 'outro' },
]

export function visibleSteps(answers: Answers): Step[] {
  return STEPS.filter((step) => !step.condition || step.condition(answers))
}
