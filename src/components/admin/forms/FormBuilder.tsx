'use client'

import { useState } from 'react'
import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import type { FormDefinition } from '@prisma/client'
import type { AttachTarget, FormFieldConfig, FormFieldType } from '@/lib/forms'

const FIELD_TYPES: FormFieldType[] = [
  'text',
  'textarea',
  'email',
  'phone',
  'number',
  'date',
  'country',
  'dropdown',
  'radio',
  'checkbox',
  'file',
  'consent',
]

const CONFIRMATION_TYPES = ['MESSAGE', 'REDIRECT'] as const

const labelClasses = 'mb-1.5 block font-sans text-xs font-semibold uppercase text-ink'

function generateFieldId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function blankField(): FormFieldConfig {
  return { id: generateFieldId(), type: 'text', label: '', required: false }
}

function AttachList({
  heading,
  name,
  items,
  formId,
  emptyText,
}: {
  heading: string
  name: string
  items: AttachTarget[]
  formId?: string
  emptyText: string
}) {
  return (
    <div>
      <p className={labelClasses}>{heading}</p>
      {items.length === 0 ? (
        <p className="font-sans text-sm text-ink-muted">{emptyText}</p>
      ) : (
        <div className="flex max-h-72 flex-col overflow-y-auto border border-border-subtle">
          {items.map((item) => {
            const usesOtherForm = item.currentForm && item.currentForm.id !== formId
            return (
              <label
                key={item.id}
                className="flex items-start gap-3 border-t border-border-subtle px-4 py-3 font-sans text-sm text-ink first:border-t-0"
              >
                <input
                  type="checkbox"
                  name={name}
                  value={item.id}
                  defaultChecked={!!formId && item.currentForm?.id === formId}
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <span>
                  {item.title}
                  {item.detail && <span className="text-ink-muted"> · {item.detail}</span>}
                  {usesOtherForm && (
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      Currently uses &ldquo;{item.currentForm!.name}&rdquo; — checking this replaces it.
                    </span>
                  )}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function FormBuilder({
  action,
  form,
  initialFields,
  events,
  programs,
}: {
  action: (formData: FormData) => Promise<void>
  form?: FormDefinition
  initialFields: FormFieldConfig[]
  /** Undefined when the current role can't edit events — hides that list. */
  events?: AttachTarget[]
  /** Undefined when the current role can't edit programs — hides that list. */
  programs?: AttachTarget[]
}) {
  const [fields, setFields] = useState<FormFieldConfig[]>(initialFields)

  function updateField(index: number, patch: Partial<FormFieldConfig>) {
    setFields((prev) => prev.map((field, i) => (i === index ? { ...field, ...patch } : field)))
  }

  function addField() {
    setFields((prev) => [...prev, blankField()])
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index))
  }

  function moveField(index: number, direction: -1 | 1) {
    setFields((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Details</legend>
        <Field label="Name" htmlFor="name" required>
          <input id="name" name="name" required defaultValue={form?.name} className={inputClasses} />
        </Field>
        <Field
          label="Slug"
          htmlFor="slug"
          hint="The form's link is /forms/your-slug. Leave blank to generate from the name — changing it later breaks links already shared."
        >
          <input id="slug" name="slug" defaultValue={form?.slug} className={inputClasses} />
        </Field>
      </fieldset>

      {(events || programs) && (
        <fieldset className="flex flex-col gap-6 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Attach To</legend>
          <p className="font-sans text-sm text-ink-muted">
            Checked events use this as their registration form; checked programs use it as their application form.
            Each event or program takes one form at a time.
          </p>
          {events && (
            <AttachList
              heading="Events — registration"
              name="eventIds"
              items={events}
              formId={form?.id}
              emptyText="No events yet."
            />
          )}
          {programs && (
            <AttachList
              heading="Programs — applications"
              name="programIds"
              items={programs}
              formId={form?.id}
              emptyText="No programs yet."
            />
          )}
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Fields</legend>

        {fields.length === 0 && (
          <p className="font-sans text-sm text-ink-muted">No fields yet. Add the first one below.</p>
        )}

        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3 border border-border-subtle p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-sans text-xs font-semibold uppercase text-ink-muted">Field {index + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveField(index, -1)}
                    disabled={index === 0}
                    aria-label="Move field up"
                    className="border border-border-strong px-2 py-1 font-sans text-xs uppercase text-ink disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveField(index, 1)}
                    disabled={index === fields.length - 1}
                    aria-label="Move field down"
                    className="border border-border-strong px-2 py-1 font-sans text-xs uppercase text-ink disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="border border-red-300 px-2 py-1 font-sans text-xs uppercase text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(index, { type: e.target.value as FormFieldType })}
                    className={inputClasses}
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Label</label>
                  <input
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Help text (optional)</label>
                <input
                  value={field.helpText ?? ''}
                  onChange={(e) => updateField(index, { helpText: e.target.value })}
                  className={inputClasses}
                />
              </div>

              {(field.type === 'dropdown' || field.type === 'radio') && (
                <div>
                  <label className={labelClasses}>Options (comma-separated)</label>
                  <input
                    value={(field.options ?? []).join(', ')}
                    onChange={(e) =>
                      // Keep raw (untrimmed, not-yet-deduped-of-blanks) segments here so a
                      // trailing "," while typing a second option doesn't get silently
                      // stripped out from under the cursor on every keystroke. Blank
                      // options are cleaned up only when the fields are serialized below.
                      updateField(index, { options: e.target.value.split(',') })
                    }
                    className={inputClasses}
                  />
                </div>
              )}

              <label className="flex items-center gap-2 font-sans text-sm text-ink">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                  className="h-4 w-4"
                />
                Required
              </label>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addField}
          className="self-start border border-brand-primary px-4 py-2 font-sans text-xs font-semibold uppercase text-brand-primary hover:bg-navy-50"
        >
          + Add Field
        </button>

        {/* The whole point of the client state above: flatten it into one JSON
            string right before submit, so the server action still receives a
            single real FormData field like everything else in this codebase.
            Options are trimmed and blank entries dropped only here, so a
            half-typed "Educator, " never gets stripped out from under the
            options input above while the admin is still typing. */}
        <input
          type="hidden"
          name="fields"
          value={JSON.stringify(
            fields.map((field) => ({
              ...field,
              options: field.options ? field.options.map((option) => option.trim()).filter(Boolean) : field.options,
            })),
          )}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Confirmation</legend>
        <Field label="Confirmation Type" htmlFor="confirmationType" required>
          <select
            id="confirmationType"
            name="confirmationType"
            required
            defaultValue={form?.confirmationType ?? 'MESSAGE'}
            className={inputClasses}
          >
            {CONFIRMATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Confirmation Message" htmlFor="confirmationMessage" hint="Shown when Confirmation Type is MESSAGE.">
          <textarea
            id="confirmationMessage"
            name="confirmationMessage"
            defaultValue={form?.confirmationMessage ?? ''}
            rows={2}
            className={inputClasses}
          />
        </Field>
        <Field label="Redirect URL" htmlFor="redirectUrl" hint="Used when Confirmation Type is REDIRECT.">
          <input id="redirectUrl" name="redirectUrl" defaultValue={form?.redirectUrl ?? ''} className={inputClasses} />
        </Field>
        <Field
          label="Notification Emails"
          htmlFor="notificationEmails"
          hint="Comma-separated. Notified whenever someone submits this form."
        >
          <input
            id="notificationEmails"
            name="notificationEmails"
            defaultValue={(form?.notificationEmails ?? []).join(', ')}
            className={inputClasses}
          />
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{form ? 'Save Form' : 'Create Form'}</SubmitButton>
      </div>
    </form>
  )
}
