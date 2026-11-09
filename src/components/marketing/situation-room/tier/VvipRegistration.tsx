'use client'

import Image from 'next/image'
import { PHONE_COUNTRY_CODES } from '@/components/marketing/situation-room/register/steps'
import { COUNTRIES } from '@/lib/countries'
import { asksToSpecify, OTHER_OPTION, otherKey, type FormFieldConfig } from '@/lib/forms'
import { SITUATION_ROOM_INTRO as INTRO, TIER_FACTS } from '@/lib/situation-room-tiers'
import { focusTierField, inputAttributes, useTierForm, type TierForm } from './useTierForm'

/**
 * VVIP: an engraved invitation. Deep emerald and gold, a fixed double frame,
 * centred formal type, square corners, and answers written on gold lines.
 * The round seal is the one curved shape on the page. The questions come from
 * the Form Builder; every question type has a VVIP rendering below.
 */

// Width stays out of the shared styles: the country code and number sit side by
// side, and a shared w-full would outrank their own widths and hide the number.
const fieldLine =
  'rounded-none border-0 border-b border-gold/50 bg-transparent px-0 py-2.5 font-serif text-[1.3rem] text-ivory transition-shadow duration-200 focus:border-gold-light focus:shadow-[0_1px_0_0_var(--color-gold-light)] focus:outline-none aria-[invalid=true]:border-red-300'

const fieldInput = `w-full ${fieldLine}`

const fieldLabel = 'block font-serif text-[1.08rem] leading-snug text-ivory'

const optionClass = 'bg-emerald-900 font-sans text-base'

function Seal() {
  return (
    <span className="mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-full bg-ivory ring-1 ring-gold-light ring-offset-4 ring-offset-emerald-900">
      <Image src="/brand/logo-mark.png" alt={INTRO.organization} width={62} height={50} preload />
    </span>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 font-sans text-[0.85rem] text-red-200">
      {message}
    </p>
  )
}

function LabelText({ field }: { field: FormFieldConfig }) {
  return (
    <>
      {field.label}
      {!field.required && <span className="ml-2 font-sans text-[0.8rem] text-emerald-100">(optional)</span>}
    </>
  )
}

function HelpText({ field }: { field: FormFieldConfig }) {
  if (!field.helpText) return null
  return <p className="mt-1.5 font-sans text-[0.88rem] leading-relaxed text-emerald-100">{field.helpText}</p>
}

function Choice({ field, form }: { field: FormFieldConfig; form: TierForm }) {
  const error = form.errors[field.id]
  return (
    <fieldset aria-describedby={error ? `${field.id}-error` : undefined}>
      <legend className={fieldLabel}>
        <LabelText field={field} />
      </legend>
      <HelpText field={field} />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(field.options ?? []).map((option, index) => (
          <label
            key={option}
            className="relative flex min-h-[52px] cursor-pointer items-center justify-center border border-gold/45 px-4 py-3 text-center font-serif text-[1.1rem] text-ivory transition-colors duration-200 hover:border-gold-light active:scale-[0.99] has-[:checked]:border-gold-light has-[:checked]:bg-gold-light has-[:checked]:text-emerald-900 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-light"
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

/** The "please specify" line under a choice whose "Other" is picked. */
function Specify({ field, form }: { field: FormFieldConfig; form: TierForm }) {
  if (!asksToSpecify(field) || form.answers[field.id] !== OTHER_OPTION) return null
  const key = otherKey(field.id)
  const value = form.answers[key]
  return (
    <div className="mt-6">
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
        className={fieldInput}
      />
      <FieldError id={`${key}-error`} message={form.errors[key]} />
    </div>
  )
}

function VvipField({ field, form }: { field: FormFieldConfig; form: TierForm }) {
  const value = form.answers[field.id]
  const text = typeof value === 'string' ? value : ''
  const error = form.errors[field.id]
  const errorId = `${field.id}-error`
  const invalid = { 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined }

  if (field.type === 'radio') {
    return (
      <div>
        <Choice field={field} form={form} />
        <Specify field={field} form={form} />
      </div>
    )
  }

  if (field.type === 'checkbox' || field.type === 'consent') {
    return (
      <div>
        <label className="flex cursor-pointer items-start gap-3 font-serif text-[1.08rem] leading-snug text-ivory">
          <input
            id={field.id}
            type="checkbox"
            checked={value === true}
            onChange={(e) => form.update(field.id, e.target.checked)}
            {...invalid}
            className="mt-1 h-5 w-5 shrink-0 accent-gold-light"
          />
          <span>
            <LabelText field={field} />
          </span>
        </label>
        <HelpText field={field} />
        <FieldError id={errorId} message={error} />
      </div>
    )
  }

  let control: React.ReactNode
  if (field.type === 'phone') {
    control = (
      <div className="flex gap-4">
        <select
          aria-label="Country code"
          autoComplete="tel-country-code"
          value={form.phoneCode(field.id)}
          onChange={(e) => form.setPhoneCode(field.id, e.target.value)}
          className={`${fieldLine} w-[5.5rem] shrink-0`}
        >
          {PHONE_COUNTRY_CODES.map((code) => (
            <option key={code} value={code} className={optionClass}>
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
          className={`${fieldLine} min-w-0 flex-1`}
        />
      </div>
    )
  } else if (field.type === 'dropdown' || field.type === 'country') {
    const options = field.type === 'country' ? COUNTRIES : (field.options ?? [])
    control = (
      <select id={field.id} value={text} onChange={(e) => form.update(field.id, e.target.value)} {...invalid} className={fieldInput}>
        <option value="" disabled className={optionClass}>
          {field.type === 'country' ? 'Select your country' : 'Select an option'}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className={optionClass}>
            {option}
          </option>
        ))}
      </select>
    )
  } else if (field.type === 'textarea') {
    control = (
      <textarea
        id={field.id}
        rows={3}
        value={text}
        onChange={(e) => form.update(field.id, e.target.value)}
        {...invalid}
        className={`${fieldInput} min-h-[6.5rem] resize-y leading-relaxed`}
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
        className={`${fieldInput} scroll-mt-16`}
      />
    )
  }

  return (
    <div>
      <label htmlFor={field.id} className={fieldLabel}>
        <LabelText field={field} />
      </label>
      <HelpText field={field} />
      {control}
      <FieldError id={errorId} message={error} />
      <Specify field={field} form={form} />
    </div>
  )
}

export function VvipRegistration({ fields, confirmationMessage }: { fields: FormFieldConfig[]; confirmationMessage: string }) {
  const form = useTierForm('VVIP', fields)

  return (
    <div
      className="relative min-h-[100dvh] bg-emerald-900 bg-no-repeat text-ivory"
      style={{
        colorScheme: 'dark',
        backgroundImage: 'radial-gradient(90% 100% at 50% 0%, var(--color-emerald-500) 0%, transparent 100%)',
        backgroundSize: '100% 70vh',
      }}
    >
      <div aria-hidden className="pointer-events-none fixed inset-2 z-10 border border-gold/50 sm:inset-4" />
      <div aria-hidden className="pointer-events-none fixed inset-[13px] z-10 border border-gold/20 sm:inset-[21px]" />

      <div className="mx-auto w-full max-w-[600px] px-8 py-14 sm:py-20">
        {form.submitted ? (
          <div className="flex min-h-[70dvh] animate-reveal flex-col justify-center text-center">
            <Seal />
            <h1 className="mt-10 font-serif text-[clamp(2rem,6vw,2.9rem)] font-semibold leading-[1.15]">
              Your VVIP registration has been received.
            </h1>
            <p className="mx-auto mt-6 max-w-[46ch] font-sans leading-[1.8] text-emerald-100">
              Thank you{form.firstName ? `, ${form.firstName}` : ''}. {confirmationMessage}
            </p>
            <p className="mx-auto mt-5 max-w-[40ch] font-serif text-[1.1rem] italic leading-[1.6] text-gold-light">
              {INTRO.closing} Looking forward to seeing you in the Situation Room.
            </p>
            <a
              href="/the-situation-room"
              className="mx-auto mt-10 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-gold-light underline-offset-4 hover:underline"
            >
              Back to The Situation Room
            </a>
          </div>
        ) : (
          <>
            <header className="animate-reveal text-center">
              <Seal />
              <p className="mt-9 font-sans text-[0.82rem] text-emerald-100">{INTRO.organization}</p>

              <div className="mt-6 flex items-center gap-4" aria-hidden>
                <span className="h-px flex-1 bg-gold/50" />
                <span className="font-serif text-[1.35rem] font-semibold tracking-[0.42em] text-gold-light">VVIP</span>
                <span className="h-px flex-1 bg-gold/50" />
              </div>

              <h1 className="mt-6 font-serif text-[clamp(2.5rem,9vw,4rem)] font-semibold leading-[1.05]">
                <span className="sr-only">VVIP Registration: </span>
                {INTRO.title}
              </h1>
              <p className="mt-4 font-serif text-[1.15rem] italic text-emerald-100">{INTRO.when}</p>

              <p className="mx-auto mt-8 max-w-[52ch] font-sans text-[0.98rem] leading-[1.85] text-emerald-100">{INTRO.body}</p>
              <p className="mt-6 font-serif text-[1.15rem] italic leading-[1.5] text-gold-light">{INTRO.closing}</p>

              <ul className="mt-9 grid grid-cols-2 gap-px border border-gold/25 bg-gold/25 text-center font-sans text-[0.86rem] leading-snug text-ivory">
                {TIER_FACTS.VVIP.map((fact) => (
                  <li key={fact} className="flex min-h-[64px] items-center justify-center bg-emerald-900 px-3 py-3 last:col-span-2">
                    {fact}
                  </li>
                ))}
              </ul>

              {fields.length > 0 && (
                <button
                  type="button"
                  onClick={() => focusTierField(fields[0].id)}
                  className="mt-10 inline-flex items-center justify-center border border-gold-light px-9 py-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-gold-light transition-colors duration-200 hover:bg-gold-light hover:text-emerald-900 active:scale-[0.98]"
                >
                  Begin Registration
                </button>
              )}
            </header>

            <div className="mx-auto my-14 h-px w-16 bg-gold-light" aria-hidden />

            {fields.length === 0 ? (
              <p className="text-center font-serif text-[1.15rem] italic text-emerald-100">Registration opens soon.</p>
            ) : (
              <form onSubmit={form.submit} noValidate className="flex flex-col gap-10">
                {fields.map((field) => (
                  <VvipField key={field.id} field={field} form={form} />
                ))}

                <div>
                  {form.submitError && (
                    <p role="alert" className="mb-5 border border-red-300/50 px-4 py-3 font-sans text-sm leading-relaxed text-red-200">
                      {form.submitError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={form.pending}
                    className="w-full bg-gold-light px-8 py-[1.1rem] font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-emerald-900 transition-[background,opacity,transform] duration-200 hover:bg-ivory active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
                  >
                    {form.pending ? 'Submitting...' : 'Submit Registration'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
