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
