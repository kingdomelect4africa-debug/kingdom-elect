import { cn } from '@/lib/cn'

type Tone = 'ivory' | 'navy' | 'navy-deep' | 'emerald' | 'dim'

const toneClasses: Record<Tone, string> = {
  ivory: 'bg-ivory text-ink',
  dim: 'bg-ivory-dim text-ink',
  navy: 'bg-navy text-ivory [&_h1]:text-ivory [&_h2]:text-ivory [&_h3]:text-ivory [&_h4]:text-ivory',
  'navy-deep': 'bg-navy-deep text-ivory [&_h1]:text-ivory [&_h2]:text-ivory [&_h3]:text-ivory [&_h4]:text-ivory',
  emerald: 'bg-emerald text-ivory [&_h2]:text-ivory [&_h3]:text-ivory',
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
    <section id={id} className={cn('relative py-[clamp(4.5rem,9vw,8.5rem)]', toneClasses[tone], className)}>
      {children}
    </section>
  )
}

export function Kicker({
  children,
  className,
  center,
  onDark,
}: {
  children: React.ReactNode
  className?: string
  center?: boolean
  onDark?: boolean
}) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-[0.6rem] font-sans text-[0.72rem] font-semibold uppercase',
        onDark ? 'text-gold-light' : 'text-gold-dark',
        center && 'justify-center',
        className,
      )}
      style={{ letterSpacing: '0.18em' }}
    >
      <span className="h-px w-[22px] shrink-0 bg-current opacity-60" aria-hidden="true" />
      {children}
    </p>
  )
}

export function Rule({ center, tone = 'gold', className }: { center?: boolean; tone?: 'gold' | 'navy'; className?: string }) {
  return (
    <span
      className={cn('mt-[1.15rem] block h-[2px] w-14', tone === 'gold' ? 'bg-gold' : 'bg-navy', center && 'mx-auto', className)}
    />
  )
}

export function LinkArrow({
  href,
  children,
  onDark,
  className,
}: {
  href: string
  children: React.ReactNode
  onDark?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 font-sans text-[0.85rem] font-semibold',
        onDark ? 'text-gold-light' : 'text-gold-dark',
        className,
      )}
    >
      {children}
      <svg viewBox="0 0 16 16" fill="none" className="h-[15px] w-[15px] transition-transform duration-400 ease-[var(--ease-signature)] group-hover:translate-x-1">
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
