'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryActionState } from '@/lib/actions/inquiry'
import { Button } from '@/components/ui/Button'

const initialState: InquiryActionState = { status: 'idle', message: '' }
const inputClasses =
  'w-full border border-border-strong bg-surface px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-muted/60 focus:border-brand-primary focus:outline-none'

export function InquiryForm({
  typeOptions,
  defaultType,
}: {
  typeOptions: { value: string; label: string }[]
  defaultType?: string
}) {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState)

  if (state.status === 'success') {
    return (
      <div className="border border-brand-secondary bg-emerald-50 p-8 text-center">
        <p className="font-serif text-xl text-brand-secondary">Message received</p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="type" className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
          What are you interested in? <span className="text-brand-accent">*</span>
        </label>
        <select id="type" name="type" required defaultValue={defaultType ?? ''} className={inputClasses}>
          <option value="" disabled>
            Select an option
          </option>
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
            Full name <span className="text-brand-accent">*</span>
          </label>
          <input id="name" name="name" type="text" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
            Email <span className="text-brand-accent">*</span>
          </label>
          <input id="email" name="email" type="email" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="organization" className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
            Organization
          </label>
          <input id="organization" name="organization" type="text" className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
          Message <span className="text-brand-accent">*</span>
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClasses} />
      </div>

      {state.status === 'error' && (
        <p className="border border-gold-600 bg-gold-50 px-4 py-3 font-sans text-sm text-gold-800">{state.message}</p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={isPending} className="mt-2">
        {isPending ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
