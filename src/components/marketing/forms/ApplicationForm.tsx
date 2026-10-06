'use client'

import { useActionState } from 'react'
import { submitApplication, type ApplicationActionState } from '@/lib/actions/application'
import { DynamicField } from './DynamicField'
import type { FormFieldConfig } from '@/lib/forms'
import { Button } from '@/components/ui/Button'

const initialState: ApplicationActionState = { status: 'idle', message: '' }

export function ApplicationForm({ programSlug, fields }: { programSlug: string; fields: FormFieldConfig[] }) {
  const [state, formAction, isPending] = useActionState(submitApplication, initialState)

  if (state.status === 'success') {
    return (
      <div className="border border-brand-secondary bg-emerald-50 p-8 text-center">
        <p className="font-serif text-xl text-brand-secondary">Application received</p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="programSlug" value={programSlug} />
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}

      {state.status === 'error' && (
        <p className="border border-gold-600 bg-gold-50 px-4 py-3 font-sans text-sm text-gold-800">{state.message}</p>
      )}

      <Button type="submit" variant="navy" disabled={isPending} className="mt-2 w-full">
        {isPending ? 'Submitting…' : 'Submit Application'}
      </Button>
    </form>
  )
}
