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
