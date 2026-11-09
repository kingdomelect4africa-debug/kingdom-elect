'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { submitSituationRoomTierRegistration } from '@/lib/actions/situation-room-tier-registration'
import { PHONE_COUNTRY_CODES } from '@/components/marketing/situation-room/register/steps'
import { checkAnswers, otherKey, type Answers, type AnswerValue, type FormFieldConfig } from '@/lib/forms'
import type { AccessTier } from '@/lib/situation-room-tiers'

/** Radio groups use `${id}-0` as the id of their first option. */
export function focusTierField(key: string) {
  const target = document.getElementById(key) ?? document.getElementById(`${key}-0`)
  target?.focus()
}

/**
 * The behaviour both forms share, for whatever questions the Form Builder
 * gives them. Each form supplies its own markup and styling.
 */
export function useTierForm(tier: AccessTier, fields: FormFieldConfig[]) {
  const [answers, setAnswers] = useState<Answers>({})
  const [phoneCodes, setPhoneCodes] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  function update(key: string, value: AnswerValue) {
    setAnswers((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setSubmitError(null)
  }

  function phoneCode(fieldId: string): string {
    return phoneCodes[fieldId] ?? PHONE_COUNTRY_CODES[0]
  }

  function setPhoneCode(fieldId: string, code: string) {
    setPhoneCodes((current) => ({ ...current, [fieldId]: code }))
  }

  /** What gets checked and sent: phone numbers carry their country code. */
  function payload(): Answers {
    const out: Answers = { ...answers }
    for (const field of fields) {
      const number = answers[field.id]
      if (field.type === 'phone' && typeof number === 'string' && number.trim()) out[field.id] = `${phoneCode(field.id)} ${number.trim()}`
    }
    return out
  }

  function showErrors(found: Record<string, string>) {
    setErrors(found)
    const first = fields.flatMap((field) => [field.id, otherKey(field.id)]).find((key) => found[key])
    if (first) requestAnimationFrame(() => focusTierField(first))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (pending) return

    const data = payload()
    const found = checkAnswers(fields, data).errors
    if (Object.keys(found).length > 0) {
      showErrors(found)
      return
    }

    startTransition(async () => {
      try {
        const result = await submitSituationRoomTierRegistration(tier, data)
        if (!result.success) {
          setSubmitError(result.message)
          if (result.errors) showErrors(result.errors)
          return
        }
        if (result.redirectUrl) {
          window.location.assign(result.redirectUrl)
          return
        }
        setSubmitted(true)
        window.scrollTo({ top: 0 })
      } catch {
        setSubmitError("We couldn't submit your registration. Please check your connection and try again. Your answers are still here.")
      }
    })
  }

  const nameField = fields.find((field) => field.id === 'full_name') ?? fields.find((field) => field.type === 'text' && /name/i.test(field.label))
  const nameAnswer = nameField ? answers[nameField.id] : ''
  const firstName = typeof nameAnswer === 'string' ? nameAnswer.trim().split(/\s+/)[0] ?? '' : ''

  return { answers, errors, submitError, submitted, pending, update, phoneCode, setPhoneCode, submit, firstName }
}

/** Browser hints for the single-line question types, shared by both designs. */
export function inputAttributes(field: FormFieldConfig): {
  type: string
  inputMode?: 'email' | 'decimal' | 'text'
  autoComplete?: string
} {
  switch (field.type) {
    case 'email':
      return { type: 'email', inputMode: 'email', autoComplete: 'email' }
    case 'number':
      return { type: 'number', inputMode: 'decimal' }
    case 'date':
      return { type: 'date' }
    default:
      return { type: 'text', autoComplete: /\bname\b/i.test(field.label) ? 'name' : undefined }
  }
}

export type TierForm = ReturnType<typeof useTierForm>
