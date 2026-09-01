'use client'

import { useEffect, useMemo, useRef, useState, useTransition, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { submitSituationRoomRegistration } from '@/lib/actions/situation-room-registration'
import { EMPTY_ANSWERS, visibleSteps, type Answers, type Step } from './steps'

const STORAGE_KEY = 'sr-registration-2026'

const inputClasses =
  'w-full border-b border-line-navy-strong bg-transparent pb-3 font-serif text-[1.4rem] text-ivory placeholder:text-faint-on-navy focus:border-gold focus:outline-none sm:text-[1.7rem]'

function isStepValid(step: Step, answers: Answers): boolean {
  switch (step.type) {
    case 'intro':
    case 'outro':
      return true
    case 'email':
      return /^\S+@\S+\.\S+$/.test(answers.email.trim())
    case 'phone':
      return answers.phone_number.trim().length >= 6
    case 'text': {
      const key = step.id as keyof Answers
      return typeof answers[key] === 'string' && (answers[key] as string).trim().length > 0
    }
    case 'select':
      if (!answers.industry_sector) return false
      if (answers.industry_sector === 'Other') return answers.industry_sector_other.trim().length > 0
      return true
    case 'choice': {
      const key = step.id as keyof Answers
      return typeof answers[key] === 'string' && (answers[key] as string).trim().length > 0
    }
    case 'textarea': {
      const key = step.id as keyof Answers
      const value = answers[key] as string
      if (step.optional) return true
      return value.trim().length > 0
    }
    case 'multichoice':
      if (answers.self_identification.length === 0) return false
      if (answers.self_identification.includes('Other')) return answers.self_identification_other.trim().length > 0
      return true
    case 'protocol':
      return answers.access_protocol_agreed
    case 'donation':
      if (!answers.donation_interest) return false
      return true
    default:
      return true
  }
}

export function RegistrationWizard({ eventCapacity }: { eventCapacity: number | null }) {
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [hydrated, setHydrated] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { answers: Answers; stepIndex: number }
        setAnswers({ ...EMPTY_ANSWERS, ...parsed.answers })
        setStepIndex(parsed.stepIndex ?? 0)
      }
    } catch {
      // Ignore malformed/unavailable storage — start fresh.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || submitted) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, stepIndex }))
    } catch {
      // Best-effort only.
    }
  }, [answers, stepIndex, hydrated, submitted])

  const steps = useMemo(() => visibleSteps(answers), [answers])

  useEffect(() => {
    if (stepIndex > steps.length - 1) setStepIndex(steps.length - 1)
  }, [steps.length, stepIndex])

  const step = steps[stepIndex]
  const isLast = step?.id === 'confirmation'
  const isSubmitStep = step?.type === 'donation'
  const questionSteps = steps.filter((s) => s.type !== 'intro' && s.type !== 'outro')
  const questionPosition = questionSteps.findIndex((s) => s.id === step?.id)

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }))
    setSubmitError(null)
  }

  function toggleMulti(option: string) {
    setAnswers((a) => {
      const has = a.self_identification.includes(option)
      return { ...a, self_identification: has ? a.self_identification.filter((o) => o !== option) : [...a.self_identification, option] }
    })
  }

  function goTo(index: number, dir: number) {
    setDirection(dir)
    setStepIndex(index)
    containerRef.current?.scrollTo?.({ top: 0 })
  }

  async function handleNext() {
    if (!step || !isStepValid(step, answers)) return

    if (isSubmitStep) {
      startTransition(async () => {
        const result = await submitSituationRoomRegistration(answers)
        if (!result.success) {
          setSubmitError(result.message)
          return
        }
        setSubmitted(true)
        try {
          window.localStorage.removeItem(STORAGE_KEY)
        } catch {
          // Ignore.
        }
        goTo(stepIndex + 1, 1)
      })
      return
    }

    goTo(Math.min(stepIndex + 1, steps.length - 1), 1)
  }

  function handleBack() {
    goTo(Math.max(stepIndex - 1, 0), -1)
  }

  function onEnterKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNext()
    }
  }

  if (!hydrated) return <div className="min-h-screen bg-navy-deep" />

  const progress = steps.length > 1 ? stepIndex / (steps.length - 1) : 0
  const valid = step ? isStepValid(step, answers) : false

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col bg-navy-deep text-ivory">
      {!isLast && (
        <div className="fixed inset-x-0 top-0 z-10 h-[3px] bg-line-navy">
          <div className="h-full bg-gold transition-[width] duration-500 ease-[var(--ease-signature)]" style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      <div className="flex flex-1 flex-col px-[clamp(1.5rem,6vw,4rem)] py-[clamp(2.5rem,6vw,4rem)]">
        {stepIndex > 0 && !isLast && (
          <div className="mb-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="font-sans text-[0.72rem] font-semibold uppercase text-faint-on-navy transition-colors hover:text-ivory"
              style={{ letterSpacing: '0.08em' }}
            >
              ← Back
            </button>
            {questionPosition >= 0 && (
              <span className="font-sans text-[0.72rem] uppercase text-faint-on-navy" style={{ letterSpacing: '0.08em' }}>
                Step {questionPosition + 1} of {questionSteps.length}
              </span>
            )}
          </div>
        )}

        <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step?.id ?? 'end'}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {step && (
                <StepContent
                  step={step}
                  answers={answers}
                  update={update}
                  toggleMulti={toggleMulti}
                  onEnterKey={onEnterKey}
                  onBegin={() => goTo(1, 1)}
                  eventCapacity={eventCapacity}
                  submitted={submitted}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {submitError && (
            <p className="mt-6 border border-red-400/40 bg-red-950/30 px-4 py-3 font-sans text-sm text-red-200">{submitError}</p>
          )}

          {step && step.type !== 'intro' && step.type !== 'outro' && (
            <div className="mt-10 flex items-center gap-4">
              <button
                type="button"
                onClick={handleNext}
                disabled={!valid || pending}
                className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-gold px-8 py-[0.95rem] font-sans text-[0.78rem] font-semibold uppercase text-navy-deep transition-[background,opacity] duration-300 hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-30"
                style={{ letterSpacing: '0.06em' }}
              >
                {pending ? 'Submitting…' : isSubmitStep ? 'Submit Registration' : 'Continue'}
              </button>
              {(step.optional || step.type === 'donation') && !isSubmitStep && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="font-sans text-[0.72rem] uppercase text-faint-on-navy underline-offset-4 hover:underline"
                  style={{ letterSpacing: '0.06em' }}
                >
                  Skip
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepContent({
  step,
  answers,
  update,
  toggleMulti,
  onEnterKey,
  onBegin,
  eventCapacity,
  submitted,
}: {
  step: Step
  answers: Answers
  update: <K extends keyof Answers>(key: K, value: Answers[K]) => void
  toggleMulti: (option: string) => void
  onEnterKey: (e: KeyboardEvent<HTMLInputElement>) => void
  onBegin: () => void
  eventCapacity: number | null
  submitted: boolean
}) {
  if (step.type === 'intro') {
    return (
      <div>
        <span className="font-sans text-[0.7rem] font-semibold uppercase text-gold-light" style={{ letterSpacing: '0.14em' }}>
          Kingdom E.L.E.C.T. for Africa
        </span>
        <h1 className="mt-4 font-serif text-[clamp(2.2rem,6vw,3.6rem)] font-semibold leading-[1.1] text-ivory">
          Africa Situation Room
        </h1>
        <p className="mt-2 font-serif text-[1.15rem] italic text-body-on-navy">Abuja &middot; December 26–29, 2026</p>
        <p className="mt-7 max-w-[540px] font-sans leading-[1.85] text-body-on-navy">
          Africa stands at the intersection of prophecy, potential, and paradox. This is a governance chamber — a
          strategic convergence of Kingdom-minded thinkers, builders, innovators and reformers committed to advancing
          God&rsquo;s purpose for Africa through influence, excellence and transformational leadership.
        </p>
        <p className="mt-4 font-serif text-[1.05rem] italic text-gold-light">This is not a conference. It is a governance chamber.</p>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[0.85rem] text-faint-on-navy">
          <span>📍 Abuja</span>
          <span>📅 Dec 26–29, 2026</span>
          <span>💵 Free event, donations welcome</span>
          <span>👥 Shared accommodation for 80</span>
        </div>

        <button
          type="button"
          onClick={onBegin}
          className="mt-10 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-gold px-8 py-[0.95rem] font-sans text-[0.78rem] font-semibold uppercase text-navy-deep transition-colors hover:bg-gold-light"
          style={{ letterSpacing: '0.06em' }}
        >
          Begin Registration
        </button>
      </div>
    )
  }

  if (step.type === 'outro') {
    return (
      <div>
        <h1 className="font-serif text-[clamp(2rem,5vw,2.8rem)] font-semibold text-ivory">
          {submitted ? "You're In the Queue." : 'One moment…'}
        </h1>
        <p className="mt-5 font-serif text-[1.1rem] italic leading-[1.7] text-body-on-navy">
          This is not a conference. It is a governance chamber.
          <br />
          Looking forward to seeing you in the Situation Room.
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-line-navy pt-6 font-sans text-[0.92rem] text-body-on-navy">
          <SummaryRow label="Full participation" value={answers.commit_full_participation} />
          <SummaryRow label="Accommodation" value={answers.accommodation_subscribe} />
          <SummaryRow label="Invitation request" value={answers.invitation_requested} />
        </div>

        <p className="mt-8 max-w-[520px] font-sans leading-[1.8] text-body-on-navy">
          {answers.invitation_requested === 'Yes, request my invitation'
            ? 'Your invitation request has been received. Selected participants will be contacted directly.'
            : 'You can request an invitation later once you are certain of attending — reach out to the organizing team via WhatsApp or email at any time.'}
        </p>
        <p className="mt-3 font-sans text-[0.85rem] text-faint-on-navy">Your responses are reviewed individually.</p>

        <a
          href="/the-situation-room"
          className="mt-8 inline-block font-sans text-[0.78rem] font-semibold uppercase text-gold-light underline-offset-4 hover:underline"
          style={{ letterSpacing: '0.06em' }}
        >
          ← Back to The Situation Room
        </a>
      </div>
    )
  }

  return (
    <div>
      {step.section && (
        <span className="mb-3 block font-sans text-[0.68rem] font-semibold uppercase text-gold-light" style={{ letterSpacing: '0.12em' }}>
          {step.section}
        </span>
      )}
      {step.question && (
        <h2 className="font-serif text-[clamp(1.4rem,3.2vw,1.9rem)] font-semibold leading-[1.3] text-ivory">{step.question}</h2>
      )}
      {step.helper && <p className="mt-3 max-w-[520px] font-sans text-[0.92rem] leading-[1.7] text-faint-on-navy">{step.helper}</p>}
      {step.optional && (
        <span className="mt-2 inline-block font-sans text-[0.7rem] uppercase text-faint-on-navy" style={{ letterSpacing: '0.06em' }}>
          Optional — skip if not applicable
        </span>
      )}

      <div className="mt-7">
        {step.type === 'email' && (
          <input
            type="email"
            autoFocus
            value={answers.email}
            onChange={(e) => update('email', e.target.value)}
            onKeyDown={onEnterKey}
            placeholder="you@example.com"
            className={inputClasses}
          />
        )}

        {step.type === 'text' && (
          <input
            type="text"
            autoFocus
            value={String(answers[step.id as keyof Answers] ?? '')}
            onChange={(e) => update(step.id as keyof Answers, e.target.value as never)}
            onKeyDown={onEnterKey}
            placeholder={step.placeholder}
            className={inputClasses}
          />
        )}

        {step.type === 'phone' && (
          <div className="flex gap-3">
            <select
              value={answers.phone_country}
              onChange={(e) => update('phone_country', e.target.value)}
              className="border-b border-line-navy-strong bg-transparent pb-3 font-sans text-[1.1rem] text-ivory focus:border-gold focus:outline-none"
            >
              {['+234', '+233', '+254', '+27', '+1', '+44', '+971'].map((code) => (
                <option key={code} value={code} className="bg-navy-deep">
                  {code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              autoFocus
              value={answers.phone_number}
              onChange={(e) => update('phone_number', e.target.value)}
              onKeyDown={onEnterKey}
              placeholder="801 234 5678"
              className={cn(inputClasses, 'flex-1')}
            />
          </div>
        )}

        {step.type === 'select' && (
          <div>
            <select
              value={answers.industry_sector}
              onChange={(e) => update('industry_sector', e.target.value)}
              className="w-full border-b border-line-navy-strong bg-transparent pb-3 font-serif text-[1.3rem] text-ivory focus:border-gold focus:outline-none"
            >
              <option value="" disabled className="bg-navy-deep">
                Select an industry
              </option>
              {step.options?.map((option) => (
                <option key={option} value={option} className="bg-navy-deep">
                  {option}
                </option>
              ))}
            </select>
            {answers.industry_sector === 'Other' && (
              <input
                type="text"
                autoFocus
                value={answers.industry_sector_other}
                onChange={(e) => update('industry_sector_other', e.target.value)}
                onKeyDown={onEnterKey}
                placeholder="Please specify"
                className={cn(inputClasses, 'mt-5')}
              />
            )}
          </div>
        )}

        {step.type === 'choice' && (
          <div className="flex flex-col gap-3">
            {step.options?.map((option) => {
              const key = step.id as keyof Answers
              const active = answers[key] === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => update(key, option as never)}
                  className={cn(
                    'rounded-[var(--radius-sm)] border px-5 py-4 text-left font-sans text-[0.98rem] transition-colors',
                    active ? 'border-gold bg-gold/10 text-ivory' : 'border-line-navy-strong text-body-on-navy hover:border-ivory',
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>
        )}

        {step.type === 'multichoice' && (
          <div>
            <div className="flex flex-col gap-3">
              {step.options?.map((option) => {
                const active = answers.self_identification.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleMulti(option)}
                    className={cn(
                      'flex items-center gap-3 rounded-[var(--radius-sm)] border px-5 py-4 text-left font-sans text-[0.95rem] transition-colors',
                      active ? 'border-gold bg-gold/10 text-ivory' : 'border-line-navy-strong text-body-on-navy hover:border-ivory',
                    )}
                  >
                    <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border', active ? 'border-gold bg-gold' : 'border-line-navy-strong')}>
                      {active && <span className="h-2 w-2 rounded-[1px] bg-navy-deep" />}
                    </span>
                    {option}
                  </button>
                )
              })}
            </div>
            {answers.self_identification.includes('Other') && (
              <input
                type="text"
                value={answers.self_identification_other}
                onChange={(e) => update('self_identification_other', e.target.value)}
                placeholder="Please specify"
                className={cn(inputClasses, 'mt-5')}
              />
            )}
          </div>
        )}

        {step.type === 'textarea' && (
          <TextareaField
            value={String(answers[step.id as keyof Answers] ?? '')}
            onChange={(v) => update(step.id as keyof Answers, v as never)}
            maxLength={step.maxLength ?? 400}
          />
        )}

        {step.type === 'protocol' && (
          <div>
            <ol className="flex flex-col gap-5">
              {['Registration (this form) indicates interest only.', 'Only selected individuals who formally request an invitation will be admitted.'].map(
                (text, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-serif text-[0.85rem] text-gold-light">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-sans text-[0.95rem] leading-[1.7] text-body-on-navy">{text}</span>
                  </li>
                ),
              )}
            </ol>
            <label className="mt-7 flex cursor-pointer items-start gap-3 font-sans text-[0.92rem] text-ivory">
              <input
                type="checkbox"
                checked={answers.access_protocol_agreed}
                onChange={(e) => update('access_protocol_agreed', e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-gold"
              />
              I understand and agree to this process.
            </label>
          </div>
        )}

        {step.type === 'donation' && (
          <div>
            <div className="flex flex-col gap-3">
              {step.options?.map((option) => {
                const active = answers.donation_interest === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update('donation_interest', option)}
                    className={cn(
                      'rounded-[var(--radius-sm)] border px-5 py-4 text-left font-sans text-[0.98rem] transition-colors',
                      active ? 'border-gold bg-gold/10 text-ivory' : 'border-line-navy-strong text-body-on-navy hover:border-ivory',
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {answers.donation_interest === 'Yes' && (
              <input
                type="text"
                value={answers.donation_pledge}
                onChange={(e) => update('donation_pledge', e.target.value)}
                placeholder="Pledge amount, or leave a note to discuss with our team"
                className={cn(inputClasses, 'mt-5')}
              />
            )}
            {eventCapacity && (
              <p className="mt-6 font-sans text-[0.78rem] text-faint-on-navy">This gathering is capped at {eventCapacity} participants.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TextareaField({ value, onChange, maxLength }: { value: string; onChange: (v: string) => void; maxLength: number }) {
  return (
    <div>
      <textarea
        autoFocus
        rows={4}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none border-b border-line-navy-strong bg-transparent pb-3 font-sans text-[1.05rem] leading-[1.7] text-ivory placeholder:text-faint-on-navy focus:border-gold focus:outline-none"
      />
      <p className="mt-2 text-right font-sans text-[0.72rem] text-faint-on-navy">
        {value.length} / {maxLength}
      </p>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-faint-on-navy">{label}</span>
      <span className="text-right text-ivory">{value}</span>
    </div>
  )
}
