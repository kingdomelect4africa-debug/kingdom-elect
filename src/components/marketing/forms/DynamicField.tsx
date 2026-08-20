import { COUNTRIES } from '@/lib/countries'
import type { FormFieldConfig } from '@/lib/forms'

const inputClasses =
  'w-full border border-border-strong bg-surface px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-muted/60 focus:border-brand-primary focus:outline-none'

export function DynamicField({ field }: { field: FormFieldConfig }) {
  const label = (
    <label htmlFor={field.id} className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
      {field.label}
      {field.required && <span className="text-brand-accent"> *</span>}
    </label>
  )

  switch (field.type) {
    case 'textarea':
      return (
        <div>
          {label}
          <textarea id={field.id} name={field.id} required={field.required} rows={4} className={inputClasses} />
        </div>
      )
    case 'country':
      return (
        <div>
          {label}
          <select id={field.id} name={field.id} required={field.required} className={inputClasses} defaultValue="">
            <option value="" disabled>
              Select a country
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )
    case 'dropdown':
      return (
        <div>
          {label}
          <select id={field.id} name={field.id} required={field.required} className={inputClasses} defaultValue="">
            <option value="" disabled>
              Select an option
            </option>
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )
    case 'radio':
      return (
        <fieldset>
          <legend className="mb-2 font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
            {field.label}
            {field.required && <span className="text-brand-accent"> *</span>}
          </legend>
          <div className="flex flex-wrap gap-4">
            {(field.options ?? []).map((option) => (
              <label key={option} className="flex items-center gap-2 font-sans text-sm text-ink">
                <input type="radio" name={field.id} value={option} required={field.required} className="accent-[--color-brand-primary]" />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      )
    case 'checkbox':
    case 'consent':
      return (
        <label className="flex items-start gap-3 font-sans text-sm text-ink">
          <input type="checkbox" id={field.id} name={field.id} required={field.required} className="mt-1 h-4 w-4 accent-[--color-brand-primary]" />
          <span>
            {field.label}
            {field.required && <span className="text-brand-accent"> *</span>}
          </span>
        </label>
      )
    case 'file':
      return (
        <div>
          {label}
          <input type="file" id={field.id} name={field.id} required={field.required} className={inputClasses} />
        </div>
      )
    default:
      return (
        <div>
          {label}
          <input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            id={field.id}
            name={field.id}
            required={field.required}
            className={inputClasses}
          />
        </div>
      )
  }
}
