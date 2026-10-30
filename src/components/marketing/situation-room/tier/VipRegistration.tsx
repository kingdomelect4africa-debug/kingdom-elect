'use client'

import Image from 'next/image'
import { PHONE_COUNTRY_CODES } from '@/components/marketing/situation-room/register/steps'
import {
  GENDER_OPTIONS,
  SECTOR_OPTIONS,
  SITUATION_ROOM_INTRO as INTRO,
  TIER_QUESTIONS as Q,
  YES_NO_OPTIONS,
  type TierAnswers,
} from '@/lib/situation-room-tiers'
import { focusTierField, useTierForm } from './useTierForm'

/**
 * VIP: a bright split screen. The introduction sits on a navy panel with the
 * Earth rising behind it, beside an ivory form of boxed fields and tap-friendly
 * tiles. Everything shares the 6px corner radius. Below 1024px the panel stacks
 * on top of the form.
 */

// Width and side padding stay out of the shared styles: the country code and
// number sit side by side, and a shared w-full would outrank their own widths
// and hide the number.
const fieldShell =
  'rounded-[var(--radius-md)] border border-navy-400/70 bg-ivory-50 py-3.5 font-sans text-base text-ink transition-colors duration-200 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy aria-[invalid=true]:border-red-700'

const fieldBox = `w-full px-4 ${fieldShell}`

const fieldLabel = 'mb-2 block font-sans text-[0.92rem] font-semibold leading-snug text-navy'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 font-sans text-[0.85rem] text-red-800">
      {message}
    </p>
  )
}

function Segmented({
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
      <div className="grid grid-cols-2 gap-2">
        {options.map((option, index) => (
          <label
            key={option}
            className="relative flex min-h-[50px] cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-navy-400/70 bg-ivory-50 px-4 font-sans text-[0.95rem] font-medium text-navy transition-colors duration-200 hover:border-navy active:scale-[0.99] has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-ivory has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ivory"
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

export function VipRegistration() {
  const { answers, errors, submitError, submitted, pending, update, submit } = useTierForm('VIP')

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
            {INTRO.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>

          {!submitted && (
            <button
              type="button"
              onClick={() => focusTierField('full_name')}
              className="mt-8 w-full rounded-[var(--radius-md)] bg-gold px-8 py-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-navy-deep transition-colors duration-200 hover:bg-gold-light active:scale-[0.99] sm:w-fit lg:hidden"
            >
              Begin Registration
            </button>
          )}
        </div>
      </aside>

      <main className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        {submitted ? (
          <div className="flex min-h-[50dvh] max-w-[34rem] animate-reveal flex-col justify-center lg:min-h-[80dvh]">
            <h2 className="font-serif text-[clamp(1.9rem,4vw,2.7rem)] font-semibold leading-[1.15] text-navy">
              Your VIP registration has been received.
            </h2>
            <p className="mt-5 font-sans leading-[1.8] text-body">
              Thank you, {answers.full_name.split(' ')[0]}. Our team will contact you directly with the next steps.
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
        ) : (
          <form onSubmit={submit} noValidate className="grid max-w-[42rem] gap-x-5 gap-y-7 sm:grid-cols-2">
            <div className="sm:col-span-2">
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
                className={`${fieldBox} scroll-mt-6`}
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
                className={fieldBox}
              />
              <FieldError id="email-error" message={errors.email} />
            </div>

            <div>
              <label htmlFor="phone_number" className={fieldLabel}>
                {Q.phone_number}
              </label>
              <div className="flex gap-2">
                <select
                  aria-label="Country code"
                  autoComplete="tel-country-code"
                  value={answers.phone_country}
                  onChange={(e) => update('phone_country', e.target.value)}
                  className={`${fieldShell} w-[5.75rem] shrink-0 px-2.5`}
                >
                  {PHONE_COUNTRY_CODES.map((code) => (
                    <option key={code} value={code}>
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
                  className={`${fieldShell} min-w-0 flex-1 px-4`}
                />
              </div>
              <FieldError id="phone_number-error" message={errors.phone_number} />
            </div>

            <div className="sm:col-span-2 sm:max-w-[calc(50%-0.625rem)]">
              <Segmented
                name="gender"
                legend={Q.gender}
                options={GENDER_OPTIONS}
                value={answers.gender}
                error={errors.gender}
                onChange={(value) => update('gender', value)}
              />
            </div>

            <fieldset className="sm:col-span-2" aria-describedby={errors.sector ? 'sector-error' : undefined}>
              <legend className={fieldLabel}>{Q.sector}</legend>
              <div className="flex flex-wrap gap-2">
                {SECTOR_OPTIONS.map((option, index) => (
                  <label
                    key={option}
                    className="relative flex min-h-11 cursor-pointer items-center rounded-[var(--radius-md)] border border-navy-400/70 bg-ivory-50 px-3.5 font-sans text-[0.9rem] text-navy transition-colors duration-200 hover:border-navy active:scale-[0.98] has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-ivory has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ivory"
                  >
                    <input
                      id={`sector-${index}`}
                      type="radio"
                      name="sector"
                      value={option}
                      checked={answers.sector === option}
                      onChange={() => update('sector', option)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <FieldError id="sector-error" message={errors.sector} />
              {answers.sector === 'Other' && (
                <div className="mt-4">
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
                    className={fieldBox}
                  />
                  <FieldError id="sector_other-error" message={errors.sector_other} />
                </div>
              )}
            </fieldset>

            <div className="sm:col-span-2">
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
                className={fieldBox}
              />
              <FieldError id="business_niche-error" message={errors.business_niche} />
            </div>

            <div className="sm:col-span-2">
              <Segmented
                name="needs_accommodation"
                legend={Q.needs_accommodation}
                options={YES_NO_OPTIONS}
                value={answers.needs_accommodation}
                error={errors.needs_accommodation}
                onChange={(value) => update('needs_accommodation', value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Segmented
                name="willing_to_partner"
                legend={Q.willing_to_partner}
                options={YES_NO_OPTIONS}
                value={answers.willing_to_partner}
                error={errors.willing_to_partner}
                onChange={(value) => update('willing_to_partner', value)}
              />
            </div>

            <div className="sm:col-span-2">
              {submitError && (
                <p role="alert" className="mb-4 rounded-[var(--radius-md)] border border-red-700/40 bg-red-50 px-4 py-3 font-sans text-sm leading-relaxed text-red-900">
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-[var(--radius-md)] bg-navy px-10 py-4 font-sans text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-ivory transition-[background,opacity,transform] duration-200 hover:bg-navy-light active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                {pending ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
