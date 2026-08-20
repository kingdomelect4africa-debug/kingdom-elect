import { cn } from '@/lib/cn'

type Tone = 'ivory' | 'navy' | 'emerald' | 'raised'

const toneClasses: Record<Tone, string> = {
  ivory: 'bg-surface text-ink',
  raised: 'bg-surface-raised text-ink',
  navy: 'bg-brand-primary text-ink-inverse',
  emerald: 'bg-brand-secondary text-ink-inverse',
}

export function Section({
  children,
  className,
  tone = 'ivory',
  id,
}: {
  children: React.ReactNode
  className?: string
  tone?: Tone
  id?: string
}) {
  return (
    <section id={id} className={cn('relative py-24 md:py-32', toneClasses[tone], className)}>
      {children}
    </section>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'font-sans text-xs font-semibold uppercase text-brand-accent',
        className,
      )}
      style={{ letterSpacing: 'var(--tracking-label)' }}
    >
      {children}
    </p>
  )
}
