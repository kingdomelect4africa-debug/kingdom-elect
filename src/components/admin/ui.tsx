import Link from 'next/link'
import { cn } from '@/lib/cn'

export const inputClasses =
  'w-full border border-border-strong bg-surface px-3.5 py-2.5 font-sans text-sm text-ink focus:border-brand-primary focus:outline-none'

export function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block font-sans text-xs font-semibold uppercase text-ink" style={{ letterSpacing: '0.05em' }}>
        {label}
        {required && <span className="text-brand-accent"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 font-sans text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl font-medium text-brand-primary">{title}</h1>
        {description && <p className="mt-1 font-sans text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  )
}

export function PrimaryLinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center bg-brand-primary px-4 py-2.5 font-sans text-xs font-semibold uppercase text-ink-inverse transition-colors hover:bg-navy-600"
      style={{ letterSpacing: '0.06em' }}
    >
      {children}
    </Link>
  )
}

export function SubmitButton({ children, pending, variant = 'primary' }: { children: React.ReactNode; pending?: boolean; variant?: 'primary' | 'danger' }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex items-center px-5 py-2.5 font-sans text-xs font-semibold uppercase transition-colors disabled:opacity-50',
        variant === 'primary' ? 'bg-brand-primary text-ink-inverse hover:bg-navy-600' : 'bg-transparent text-red-700 border border-red-300 hover:bg-red-50',
      )}
      style={{ letterSpacing: '0.06em' }}
    >
      {children}
    </button>
  )
}

export function EmptyState({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string
  body: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="border border-dashed border-border-strong p-12 text-center">
      <p className="font-serif text-lg text-brand-primary">{title}</p>
      <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-ink-muted">{body}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <PrimaryLinkButton href={actionHref}>{actionLabel} →</PrimaryLinkButton>
        </div>
      )}
    </div>
  )
}

export const th = 'px-4 py-3 text-left font-sans text-xs font-semibold uppercase text-ink-muted'
export const td = 'px-4 py-3 font-sans text-sm text-ink'
export const tr = 'border-b border-border-subtle last:border-0 hover:bg-navy-50/50'

export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'muted' }) {
  const toneClasses: Record<string, string> = {
    default: 'bg-navy-50 text-brand-primary',
    success: 'bg-emerald-50 text-brand-secondary',
    warning: 'bg-gold-50 text-gold-800',
    muted: 'bg-charcoal-50 text-ink-muted',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 font-sans text-xs font-medium uppercase', toneClasses[tone])} style={{ letterSpacing: '0.04em' }}>
      {children}
    </span>
  )
}
