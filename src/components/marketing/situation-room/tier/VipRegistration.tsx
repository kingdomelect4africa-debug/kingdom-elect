'use client'

import Image from 'next/image'
import { PHONE_COUNTRY_CODES } from '@/components/marketing/situation-room/register/steps'
import { COUNTRIES } from '@/lib/countries'
import { asksToSpecify, OTHER_OPTION, otherKey, type FormFieldConfig } from '@/lib/forms'
import { SITUATION_ROOM_INTRO as INTRO, TIER_FACTS } from '@/lib/situation-room-tiers'
import { focusTierField, inputAttributes, useTierForm, type TierForm } from './useTierForm'

/**
 * VIP: a bright split screen. The introduction sits on a navy panel with the
 * Earth rising behind it, beside an ivory form of boxed fields and tap-friendly
 * tiles. Everything shares the 6px corner radius. Below 1024px the panel stacks
 * on top of the form. The questions come from the Form Builder; every question
 * type has a VIP rendering below.
 */

// Width and side padding stay out of the shared styles: the country code and
// number sit side by side, and a shared w-full would outrank their own widths
// and hide the number.
const fieldShell =
  'rounded-[var(--radius-md)] border border-navy-400/70 bg-ivory-50 py-3.5 font-sans text-base text-ink transition-colors duration-200 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy aria-[invalid=true]:border-red-700'

const fieldBox = `w-full px-4 ${fieldShell}`

const fieldLabel = 'mb-2 block font-sans text-[0.92rem] font-semibold leading-snug text-navy'

const tile =
  'relative flex cursor-pointer items-center rounded-[var(--radius-md)] border border-navy-400/70 bg-ivory-50 font-sans text-navy transition-colors duration-200 hover:border-navy has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-ivory has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ivory'

/** Short single-line answers pair up two to a row; everything else is full width. */
function columnSpan(field: FormFieldConfig): string {
  if (['email', 'phone', 'number', 'date', 'country'].includes(field.type)) return ''
  if (field.type === 'radio' && (field.options ?? []).length <= 2 && field.label.length <= 30) {
    return 'sm:col-span-2 sm:max-w-[calc(50%-0.625rem)]'
  }
  return 'sm:col-span-2'
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 font-sans text-[0.85rem] text-red-800">
      {message}
    </p>
  )
}

function LabelText({ field }: { field: FormFieldConfig }) {
  return (
    <>
      {field.label}
      {!field.required && <span className="ml-1.5 font-normal text-ink-muted">(optional)</span>}
    </>
  )
}

function HelpText({ field }: { field: FormFieldConfig }) {
  if (!field.helpText) return null
  return <p className="-mt-1 mb-2 font-sans text-[0.85rem] leading-relaxed text-body">{field.helpText}</p>
}

/** Radio questions as a row of tiles; dropdowns as wrapping chips. */
function Choices({ field, form, chips }: { field: FormFieldConfig; form: TierForm; chips: boolean }) {
  const error = form.errors[field.id]
  return (
    <fieldset aria-describedby={error ? `${field.id}-error` : undefined}>
      <legend className={fieldLabel}>
        <LabelText field={field} />
      </legend>
      <HelpText field={field} />
      <div className={chips ? 'flex flex-wrap gap-2' : 'grid grid-cols-2 gap-2'}>
        {(field.options ?? []).map((option, index) => (
          <label
            key={option}
            className={`${tile} ${chips ? 'min-h-11 px-3.5 text-[0.9rem] active:scale-[0.98]' : 'min-h-[50px] justify-center px-4 text-center text-[0.95rem] font-medium active:scale-[0.99]'}`}
          >
            <input
              id={`${field.id}-${index}`}
              type="radio"
              name={field.id}
              value={option}
              checked={form.answers[field.id] === option}
              onChange={() => form.update(field.id, option)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {option}
          </label>
        ))}
      </div>
      <FieldError id={`${field.id}-error`} message={error} />
    </fieldset>
  )
}

/** The "please specify" box under a choice whose "Other" is picked. */
function Specify({ field, form }: { field: FormFieldConfig; form: TierForm }) {
  if (!asksToSpecify(field) || form.answers[field.id] !== OTHER_OPTION) return null
  const key = otherKey(field.id)
  const value = form.answers[key]
  return (
    <div className="mt-4">
      <label htmlFor={key} className={fieldLabel}>
        Please specify
      </label>
      <input
        id={key}
        type="text"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => form.update(key, e.target.value)}
        aria-invalid={Boolean(form.errors[key])}
        aria-describedby={form.errors[key] ? `${key}-error` : undefined}
        className={fieldBox}
      />
      <FieldError id={`${key}-error`} message={form.errors[key]} />
    </div>
  )
}

function VipField({ field, form }: { field: FormFieldConfig; form: TierForm }) {
  const value = form.answers[field.id]
  const text = typeof value === 'string' ? value : ''
  const error = form.errors[field.id]
  const errorId = `${field.id}-error`
  const invalid = { 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined }

  if (field.type === 'radio' || field.type === 'dropdown') {
    return (
      <div className={columnSpan(field)}>
        <Choices field={field} form={form} chips={field.type === 'dropdown'} />
        <Specify field={field} form={form} />
      </div>
    )
  }

  if (field.type === 'checkbox' || field.type === 'consent') {
    return (
      <div className={columnSpan(field)}>
        <label className="flex cursor-pointer items-start gap-3 font-sans text-[0.95rem] leading-snug text-navy">
          <input
            id={field.id}
            type="checkbox"
            checked={value === true}
            onChange={(e) => form.update(field.id, e.target.checked)}
            {...invalid}
            className="mt-0.5 h-5 w-5 shrink-0 accent-navy"
          />
          <span>
            <LabelText field={field} />
          </span>
        </label>
        {field.helpText && <p className="mt-1.5 pl-8 font-sans text-[0.85rem] leading-relaxed text-body">{field.helpText}</p>}
        <FieldError id={errorId} message={error} />
      </div>
    )
  }

  let control: React.ReactNode
  if (field.type === 'phone') {
    control = (
      <div className="flex gap-2">
        <select
          aria-label="Country code"
          autoComplete="tel-country-code"
          value={form.phoneCode(field.id)}
          onChange={(e) => form.setPhoneCode(field.id, e.target.value)}
          className={`${fieldShell} w-[5.75rem] shrink-0 px-2.5`}
        >
          {PHONE_COUNTRY_CODES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <input
          id={field.id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={text}
          onChange={(e) => form.update(field.id, e.target.value)}
          {...invalid}
          className={`${fieldShell} min-w-0 flex-1 px-4`}
        />
      </div>
    )
  } else if (field.type === 'country') {
    control = (
      <select id={field.id} value={text} onChange={(e) => form.update(field.id, e.target.value)} {...invalid} className={fieldBox}>
        <option value="" disabled>
          Select your country
        </option>
        {COUNTRIES.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    )
  } else if (field.type === 'textarea') {
    control = (
      <textarea
        id={field.id}
        rows={4}
        value={text}
        onChange={(e) => form.update(field.id, e.target.value)}
        {...invalid}
        className={`${fieldBox} min-h-[7rem] resize-y leading-relaxed`}
      />
    )
  } else {
    control = (
      <input
        id={field.id}
        {...inputAttributes(field)}
        value={text}
        onChange={(e) => form.update(field.id, e.target.value)}
        {...invalid}
        className={`${fieldBox} scroll-mt-6`}
      />
    )
  }

  return (
    <div className={columnSpan(field)}>
      <label htmlFor={field.id} className={fieldLabel}>
        <LabelText field={field} />
      </label>
      <HelpText field={field} />
      {control}
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export function VipRegistration({ fields, confirmationMessage }: { fields: FormFieldConfig[]; confirmationMessage: string }) {
  const form = useTierForm('VIP', fields)

  return (
    <div className="min-h-[100dvh] bg-ivory text-ink lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative isolate overflow-hidden bg-navy text-ivory lg:sticky lg:top-0 lg:h-[100dvh] lg:overflow-y-auto">
        <Image
          src="/brand/earth-africa.jpg"
          alt=""
          width={1349}
          height={1400}
          sizes="(min-width: 1024px) 34vw, 90vw"
          preload
          className="pointer-events-none absolute -bottom-[34%] -right-[34%] -z-10 w-[92%] opacity-55 mix-blend-screen lg:-bottom-[22%] lg:w-[88%]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/20" />

        <div className="flex min-h-full animate-reveal flex-col px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-ivory">
              <Image src="/brand/logo-mark.png" alt="" width={42} height={34} preload />
            </span>
            <span className="font-sans text-[0.85rem] leading-snug text-ivory">{INTRO.organization}</span>
          </div>

          <p className="mt-9 w-fit rounded-[var(--radius-sm)] bg-gold px-3 py-1.5 font-sans text-[0.72rem] font-bold uppercase tracking-[0.14em] text-navy-deep">
            VIP Registration
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.3rem,4.4vw,3.5rem)] font-semibold leading-[1.06]">{INTRO.title}</h1>
          <p className="mt-3 font-serif text-[1.08rem] italic text-body-on-navy">{INTRO.when}</p>

          <p className="mt-6 max-w-[46ch] font-sans text-[0.95rem] leading-[1.75] text-ivory/90">{INTRO.body}</p>
          <p className="mt-4 max-w-[42ch] font-serif text-[1.08rem] italic leading-[1.5] text-gold-light">{INTRO.closing}</p>

          <ul className="mt-7 grid max-w-[30rem] grid-cols-2 gap-x-5 gap-y-3 border-t border-line-navy-strong pt-5 font-sans text-[0.85rem] leading-snug text-ivory">
            {TIER_FACTS.VIP.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>

          {!form.submitted && fields.length > 0 && (
            <button
              type="button"
              onClick={() => focusTierField(fields[0].id)}
              className="mt-8 w-full rounded-[var(--radius-md)] bg-gold px-8 py-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-navy-deep transition-colors duration-200 hover:bg-gold-light active:scale-[0.99] sm:w-fit lg:hidden"
            >
              Begin Registration
            </button>
          )}
        </div>
      </aside>

      <main className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        {form.submitted ? (
          <div className="flex min-h-[50dvh] max-w-[34rem] animate-reveal flex-col justify-center lg:min-h-[80dvh]">
            <h2 className="font-serif text-[clamp(1.9rem,4vw,2.7rem)] font-semibold leading-[1.15] text-navy">
              Your VIP registration has been received.
            </h2>
            <p className="mt-5 font-sans leading-[1.8] text-body">
              Thank you{form.firstName ? `, ${form.firstName}` : ''}. {confirmationMessage}
            </p>
            <p className="mt-4 font-serif text-[1.08rem] italic leading-[1.6] text-navy">
              {INTRO.closing} Looking forward to seeing you in the Situation Room.
            </p>
            <a
              href="/the-situation-room"
              className="mt-8 w-fit font-sans text-[0.9rem] font-semibold text-navy underline underline-offset-4"
            >
              Back to The Situation Room
            </a>
          </div>
        ) : fields.length === 0 ? (
          <p className="font-serif text-[1.15rem] italic text-navy">Registration opens soon.</p>
        ) : (
          <form onSubmit={form.submit} noValidate className="grid max-w-[42rem] gap-x-5 gap-y-7 sm:grid-cols-2">
            {fields.map((field) => (
              <VipField key={field.id} field={field} form={form} />
            ))}

            <div className="sm:col-span-2">
              {form.submitError && (
                <p role="alert" className="mb-4 rounded-[var(--radius-md)] border border-red-700/40 bg-red-50 px-4 py-3 font-sans text-sm leading-relaxed text-red-900">
                  {form.submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={form.pending}
                className="w-full rounded-[var(--radius-md)] bg-navy px-10 py-4 font-sans text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-ivory transition-[background,opacity,transform] duration-200 hover:bg-navy-light active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                {form.pending ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
