'use client'

import { useActionState } from 'react'
import { submitFormResponse, type FormResponseActionState } from '@/lib/actions/form-response'
import { DynamicField } from './DynamicField'
import type { FormFieldConfig } from '@/lib/forms'
import { Button } from '@/components/ui/Button'

const initialState: FormResponseActionState = { status: 'idle', message: '' }

export function StandaloneForm({ formSlug, fields }: { formSlug: string; fields: FormFieldConfig[] }) {
  const [state, formAction, isPending] = useActionState(submitFormResponse, initialState)

  if (state.status === 'success') {
    return (
      <div className="border border-brand-secondary bg-emerald-50 p-8 text-center">
        <p className="font-serif text-xl text-brand-secondary">Response received</p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="formSlug" value={formSlug} />
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}

      {state.status === 'error' && (
        <p className="border border-gold-600 bg-gold-50 px-4 py-3 font-sans text-sm text-gold-800">{state.message}</p>
      )}

      <Button type="submit" variant="navy" disabled={isPending} className="mt-2 w-full">
        {isPending ? 'Submitting…' : 'Submit'}
      </Button>
    </form>
  )
}
