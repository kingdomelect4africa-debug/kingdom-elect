import Link from 'next/link'
import { LogoMark } from './LogoMark'
import { cn } from '@/lib/cn'

export function Logo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const textColor = tone === 'dark' ? 'text-brand-primary' : 'text-ink-inverse'
  const subColor = tone === 'dark' ? 'text-ink-muted' : 'text-ivory-600'

  return (
    <Link href="/" className={cn('group flex items-center gap-3', className)} aria-label="Kingdom E.L.E.C.T. for Africa — home">
      <LogoMark className="h-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={cn('font-serif text-lg font-semibold tracking-tight', textColor)}>
          Kingdom E.L.E.C.T.
        </span>
        <span
          className={cn('font-sans text-[10px] font-semibold uppercase', subColor)}
          style={{ letterSpacing: 'var(--tracking-label)' }}
        >
          For Africa
        </span>
      </span>
    </Link>
  )
}
