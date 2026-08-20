'use client'

import { useActionState } from 'react'
import { login, type LoginActionState } from '@/lib/actions/auth'

const initialState: LoginActionState = { status: 'idle', message: '' }
const inputClasses =
  'w-full border border-border-strong bg-surface px-4 py-3 font-sans text-sm text-ink focus:border-brand-primary focus:outline-none'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.06em' }}>
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={inputClasses} />
      </div>

      {state.status === 'error' && (
        <p className="border border-gold-600 bg-gold-50 px-4 py-3 font-sans text-sm text-gold-800">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 bg-brand-primary px-6 py-3 font-sans text-sm font-semibold uppercase text-ink-inverse transition-colors hover:bg-navy-600 disabled:opacity-50"
        style={{ letterSpacing: '0.06em' }}
      >
        {isPending ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
