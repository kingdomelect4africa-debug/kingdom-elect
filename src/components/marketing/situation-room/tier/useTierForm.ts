'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { submitSituationRoomTierRegistration } from '@/lib/actions/situation-room-tier-registration'
import {
  EMPTY_TIER_ANSWERS,
  TIER_FIELD_ORDER,
  validateTierAnswers,
  type AccessTier,
  type TierAnswers,
  type TierErrors,
} from '@/lib/situation-room-tiers'

/** Radio groups use `${key}-0` as the id of their first option. */
export function focusTierField(key: keyof TierAnswers) {
  const target = document.getElementById(key) ?? document.getElementById(`${key}-0`)
  target?.focus()
}

/** The behaviour both forms share. Each form supplies its own markup and styling. */
export function useTierForm(tier: AccessTier) {
  const [answers, setAnswers] = useState<TierAnswers>(EMPTY_TIER_ANSWERS)
  const [errors, setErrors] = useState<TierErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  function update(key: keyof TierAnswers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setSubmitError(null)
  }

  function showErrors(found: TierErrors) {
    setErrors(found)
    const first = TIER_FIELD_ORDER.find((key) => found[key])
    if (first) requestAnimationFrame(() => focusTierField(first))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (pending) return

    const found = validateTierAnswers(answers, tier)
    if (Object.keys(found).length > 0) {
      showErrors(found)
      return
    }

    startTransition(async () => {
      try {
        const result = await submitSituationRoomTierRegistration(tier, answers)
        if (!result.success) {
          setSubmitError(result.message)
          if (result.errors) showErrors(result.errors)
          return
        }
        setSubmitted(true)
        window.scrollTo({ top: 0 })
      } catch {
        setSubmitError("We couldn't submit your registration. Please check your connection and try again. Your answers are still here.")
      }
    })
  }

  return { answers, errors, submitError, submitted, pending, update, submit }
}
