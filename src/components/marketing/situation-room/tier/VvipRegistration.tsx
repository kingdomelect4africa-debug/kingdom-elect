'use client'

import Image from 'next/image'
import { PHONE_COUNTRY_CODES } from '@/components/marketing/situation-room/register/steps'
import {
  GENDER_OPTIONS,
  SECTOR_OPTIONS,
  SITUATION_ROOM_INTRO as INTRO,
  TIER_FACTS,
  TIER_QUESTIONS as Q,
  YES_NO_OPTIONS,
  type TierAnswers,
} from '@/lib/situation-room-tiers'
import { focusTierField, useTierForm } from './useTierForm'

/**
 * VVIP: an engraved invitation. Deep emerald and gold, a fixed double frame,
 * centred formal type, square corners, and answers written on gold lines.
 * The round seal is the one curved shape on the page.
 */

// Width stays out of the shared styles: the country code and number sit side by
// side, and a shared w-full would outrank their own widths and hide the number.
const fieldLine =
  'rounded-none border-0 border-b border-gold/50 bg-transparent px-0 py-2.5 font-serif text-[1.3rem] text-ivory transition-shadow duration-200 focus:border-gold-light focus:shadow-[0_1px_0_0_var(--color-gold-light)] focus:outline-none aria-[invalid=true]:border-red-300'

const fieldInput = `w-full ${fieldLine}`

const fieldLabel = 'block font-serif text-[1.08rem] leading-snug text-ivory'

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

function Choice({
  name,
  legend,
  options,
  value,
  error,
  onChange,
}: {
  name: keyof TierAnswers
  legend: string
  options: string[]
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className={fieldLabel}>{legend}</legend>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <label
            key={option}
            className="relative flex min-h-[52px] cursor-pointer items-center justify-center border border-gold/45 px-4 py-3 font-serif text-[1.1rem] text-ivory transition-colors duration-200 hover:border-gold-light active:scale-[0.99] has-[:checked]:border-gold-light has-[:checked]:bg-gold-light has-[:checked]:text-emerald-900 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-light"
          >
            <input
              id={`${name}-${index}`}
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {option}
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  )
}

export function VvipRegistration() {
  const { answers, errors, submitError, submitted, pending, update, submit } = useTierForm('VVIP')

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
        {submitted ? (
          <div className="flex min-h-[70dvh] animate-reveal flex-col justify-center text-center">
            <Seal />
            <h1 className="mt-10 font-serif text-[clamp(2rem,6vw,2.9rem)] font-semibold leading-[1.15]">
              Your VVIP registration has been received.
            </h1>
            <p className="mx-auto mt-6 max-w-[46ch] font-sans leading-[1.8] text-emerald-100">
              Thank you, {answers.full_name.split(' ')[0]}. Our team will contact you directly with the next steps.
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

              <button
                type="button"
                onClick={() => focusTierField('full_name')}
                className="mt-10 inline-flex items-center justify-center border border-gold-light px-9 py-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-gold-light transition-colors duration-200 hover:bg-gold-light hover:text-emerald-900 active:scale-[0.98]"
              >
                Begin Registration
              </button>
            </header>

            <div className="mx-auto my-14 h-px w-16 bg-gold-light" aria-hidden />

            <form onSubmit={submit} noValidate className="flex flex-col gap-10">
              <div>
                <label htmlFor="full_name" className={fieldLabel}>
                  {Q.full_name}
                </label>
                <input
                  id="full_name"
                  type="text"
                  autoComplete="name"
                  enterKeyHint="next"
                  value={answers.full_name}
                  onChange={(e) => update('full_name', e.target.value)}
                  aria-invalid={Boolean(errors.full_name)}
                  aria-describedby={errors.full_name ? 'full_name-error' : undefined}
                  className={`${fieldInput} scroll-mt-16`}
                />
                <FieldError id="full_name-error" message={errors.full_name} />
              </div>

              <div>
                <label htmlFor="email" className={fieldLabel}>
                  {Q.email}
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  value={answers.email}
                  onChange={(e) => update('email', e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={fieldInput}
                />
                <FieldError id="email-error" message={errors.email} />
              </div>

              <div>
                <label htmlFor="phone_number" className={fieldLabel}>
                  {Q.phone_number}
                </label>
                <div className="flex gap-4">
                  <select
                    aria-label="Country code"
                    autoComplete="tel-country-code"
                    value={answers.phone_country}
                    onChange={(e) => update('phone_country', e.target.value)}
                    className={`${fieldLine} w-[5.5rem] shrink-0`}
                  >
                    {PHONE_COUNTRY_CODES.map((code) => (
                      <option key={code} value={code} className="bg-emerald-900 font-sans text-base">
                        {code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone_number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    value={answers.phone_number}
                    onChange={(e) => update('phone_number', e.target.value)}
                    aria-invalid={Boolean(errors.phone_number)}
                    aria-describedby={errors.phone_number ? 'phone_number-error' : undefined}
                    className={`${fieldLine} min-w-0 flex-1`}
                  />
                </div>
                <FieldError id="phone_number-error" message={errors.phone_number} />
              </div>

              <Choice
                name="gender"
                legend={Q.gender}
                options={GENDER_OPTIONS}
                value={answers.gender}
                error={errors.gender}
                onChange={(value) => update('gender', value)}
              />

              <div>
                <label htmlFor="sector" className={fieldLabel}>
                  {Q.sector}
                </label>
                <select
                  id="sector"
                  value={answers.sector}
                  onChange={(e) => update('sector', e.target.value)}
                  aria-invalid={Boolean(errors.sector)}
                  aria-describedby={errors.sector ? 'sector-error' : undefined}
                  className={fieldInput}
                >
                  <option value="" disabled className="bg-emerald-900 font-sans text-base">
                    Select your sector
                  </option>
                  {SECTOR_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-emerald-900 font-sans text-base">
                      {option}
                    </option>
                  ))}
                </select>
                <FieldError id="sector-error" message={errors.sector} />
                {answers.sector === 'Other' && (
                  <div className="mt-6">
                    <label htmlFor="sector_other" className={fieldLabel}>
                      {Q.sector_other}
                    </label>
                    <input
                      id="sector_other"
                      type="text"
                      value={answers.sector_other}
                      onChange={(e) => update('sector_other', e.target.value)}
                      aria-invalid={Boolean(errors.sector_other)}
                      aria-describedby={errors.sector_other ? 'sector_other-error' : undefined}
                      className={fieldInput}
                    />
                    <FieldError id="sector_other-error" message={errors.sector_other} />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="business_niche" className={fieldLabel}>
                  {Q.business_niche}
                </label>
                <input
                  id="business_niche"
                  type="text"
                  value={answers.business_niche}
                  onChange={(e) => update('business_niche', e.target.value)}
                  aria-invalid={Boolean(errors.business_niche)}
                  aria-describedby={errors.business_niche ? 'business_niche-error' : undefined}
                  className={fieldInput}
                />
                <FieldError id="business_niche-error" message={errors.business_niche} />
              </div>

              <Choice
                name="willing_to_partner"
                legend={Q.willing_to_partner}
                options={YES_NO_OPTIONS}
                value={answers.willing_to_partner}
                error={errors.willing_to_partner}
                onChange={(value) => update('willing_to_partner', value)}
              />

              <div>
                {submitError && (
                  <p role="alert" className="mb-5 border border-red-300/50 px-4 py-3 font-sans text-sm leading-relaxed text-red-200">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-gold-light px-8 py-[1.1rem] font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-emerald-900 transition-[background,opacity,transform] duration-200 hover:bg-ivory active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
                >
                  {pending ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
