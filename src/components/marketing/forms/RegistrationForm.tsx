'use client'

import { useActionState } from 'react'
import { submitRegistration, type RegistrationActionState } from '@/lib/actions/registration'
import { DynamicField } from './DynamicField'
import type { FormFieldConfig } from '@/lib/forms'
import { Button } from '@/components/ui/Button'

const initialState: RegistrationActionState = { status: 'idle', message: '' }

export function RegistrationForm({ eventSlug, fields }: { eventSlug: string; fields: FormFieldConfig[] }) {
  const [state, formAction, isPending] = useActionState(submitRegistration, initialState)

  if (state.status === 'success') {
    return (
      <div className="border border-brand-secondary bg-emerald-50 p-8 text-center">
        <p className="font-serif text-xl text-brand-secondary">Registration confirmed</p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="eventSlug" value={eventSlug} />
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}

      {state.status === 'error' && (
        <p className="border border-gold-600 bg-gold-50 px-4 py-3 font-sans text-sm text-gold-800">{state.message}</p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={isPending} className="mt-2">
        {isPending ? 'Submitting…' : 'Complete Registration'}
      </Button>
    </form>
  )
}
