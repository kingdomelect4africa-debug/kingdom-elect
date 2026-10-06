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
