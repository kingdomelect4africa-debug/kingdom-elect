import { COUNTRIES } from '@/lib/countries'

export type FormFieldType =
  | 'text' | 'textarea' | 'email' | 'phone' | 'number' | 'date'
  | 'country' | 'dropdown' | 'radio' | 'checkbox' | 'file' | 'consent'

export type FormFieldConfig = {
  id: string
  type: FormFieldType
  label: string
  required: boolean
  helpText?: string
  options?: string[]
  /** Dropdown/radio only: picking "Other" shows a box asking them to specify. */
  specifyOther?: boolean
}

export const OTHER_OPTION = 'Other'

/** Name of the "please specify" box shown when a field's "Other" is picked. */
export function otherKey(fieldId: string): string {
  return `${fieldId}__other`
}

export function asksToSpecify(field: FormFieldConfig): boolean {
  return (
    Boolean(field.specifyOther) &&
    (field.type === 'dropdown' || field.type === 'radio') &&
    (field.options ?? []).includes(OTHER_OPTION)
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Text fields labelled "Email" get no browser validation, so check here. */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email)
}

/**
 * Whether a field collects the respondent's email — the email type, or a
 * plain text field labelled as one ("Email address" built as `text` is common,
 * and registrations/applications are tied to a Person by that email).
 */
export function isEmailField(field: FormFieldConfig): boolean {
  return field.id === 'email' || field.type === 'email' || (field.type === 'text' && /e-?mail/i.test(field.label))
}

/**
 * Field id → label for a stored FormDefinition.fields value. Responses are
 * keyed by field id, and Form Builder ids are random, so admin screens need
 * this to show "Email address" rather than a UUID.
 */
export function fieldLabels(fields: unknown): Record<string, string> {
  if (!Array.isArray(fields)) return {}
  return Object.fromEntries(
    (fields as FormFieldConfig[]).filter((field) => field?.id && field.label).map((field) => [field.id, field.label]),
  )
}

/** An event or program the Form Builder can attach a form to. */
export type AttachTarget = {
  id: string
  title: string
  detail?: string
  currentForm: { id: string; name: string } | null
}

export type AnswerValue = string | boolean
export type Answers = Record<string, AnswerValue>

/**
 * Checks answers sent as JSON (the VVIP and VIP pages) against a form's fields
 * and returns what to store, keyed by field id. The same check runs in the
 * browser for instant feedback and again on the server, which trusts nothing
 * the browser sent. Errors are keyed by field id, or by otherKey(id) for a
 * missing "please specify".
 */
export function checkAnswers(fields: FormFieldConfig[], raw: unknown): { errors: Record<string, string>; responses: Answers } {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const errors: Record<string, string> = {}
  const responses: Answers = {}
  const text = (key: string, max: number) => {
    const value = source[key]
    return typeof value === 'string' ? value.trim().slice(0, max) : ''
  }

  for (const field of fields) {
    // These pages have nowhere to store uploads.
    if (field.type === 'file') continue

    if (field.type === 'checkbox' || field.type === 'consent') {
      const checked = source[field.id] === true
      if (field.required && !checked) errors[field.id] = 'Please tick this to continue.'
      responses[field.id] = checked
      continue
    }

    const value = text(field.id, field.type === 'textarea' ? 5000 : 500)
    responses[field.id] = value
    if (!value) {
      if (field.required) {
        const picksOne = field.type === 'dropdown' || field.type === 'radio' || field.type === 'country'
        errors[field.id] = picksOne ? 'Please choose an option.' : 'Please answer this question.'
      }
      continue
    }

    if (field.type === 'email' && !isValidEmail(value)) {
      errors[field.id] = 'Please enter a valid email address.'
    } else if (field.type === 'phone' && value.replace(/^\+\d{1,4}\s+/, '').replace(/\D/g, '').length < 7) {
      errors[field.id] = 'Please enter your full number.'
    } else if (field.type === 'number' && !Number.isFinite(Number(value))) {
      errors[field.id] = 'Please enter a number.'
    } else if (field.type === 'date' && Number.isNaN(Date.parse(value))) {
      errors[field.id] = 'Please enter a date.'
    } else if ((field.type === 'dropdown' || field.type === 'radio') && !(field.options ?? []).includes(value)) {
      errors[field.id] = 'Please choose one of the options.'
    } else if (field.type === 'country' && !(COUNTRIES as readonly string[]).includes(value)) {
      errors[field.id] = 'Please choose a country.'
    } else if (asksToSpecify(field) && value === OTHER_OPTION) {
      // Store what they typed, like the main registration form does for Sector.
      const detail = text(otherKey(field.id), 200)
      if (detail) responses[field.id] = detail
      else if (field.required) errors[otherKey(field.id)] = 'Please specify.'
    }
  }

  return { errors, responses }
}
