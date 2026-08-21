'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryActionState } from '@/lib/actions/inquiry'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const initialState: InquiryActionState = { status: 'idle', message: '' }

const labelClasses = 'mb-[0.6rem] block font-sans text-[0.72rem] font-bold uppercase text-body'
const labelStyle = { letterSpacing: '0.08em' } as const
const inputClasses =
  'w-full rounded-[var(--radius-sm)] border border-line-strong bg-ivory px-4 py-[0.85rem] font-sans text-[0.92rem] text-ink transition-colors duration-300 placeholder:text-body/60 focus:border-gold-dark focus:outline-none'

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
      <div className="border border-emerald bg-ivory-dim p-8 text-center">
        <p className="font-serif text-xl font-semibold text-emerald">Message received</p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="type" className={labelClasses} style={labelStyle}>
          What are you interested in? <span className="text-gold-dark">*</span>
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

      <div>
        <label htmlFor="name" className={labelClasses} style={labelStyle}>
          Full Name <span className="text-gold-dark">*</span>
        </label>
        <input id="name" name="name" type="text" required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="email" className={labelClasses} style={labelStyle}>
          Email <span className="text-gold-dark">*</span>
        </label>
        <input id="email" name="email" type="email" required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="phone" className={labelClasses} style={labelStyle}>
          Phone
        </label>
        <input id="phone" name="phone" type="tel" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="organization" className={labelClasses} style={labelStyle}>
          Organization
        </label>
        <input id="organization" name="organization" type="text" className={inputClasses} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClasses} style={labelStyle}>
          Message <span className="text-gold-dark">*</span>
        </label>
        <textarea id="message" name="message" required rows={5} className={cn(inputClasses, 'min-h-[130px] resize-y')} />
      </div>

      {state.status === 'error' && (
        <p className="sm:col-span-2 border border-gold-dark bg-ivory-dim px-4 py-3 font-sans text-sm text-ink">{state.message}</p>
      )}

      <Button type="submit" variant="navy" disabled={isPending} className="w-full sm:col-span-2">
        {isPending ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
