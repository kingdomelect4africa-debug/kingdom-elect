import Link from 'next/link'
import { LogoMark } from './LogoMark'
import { cn } from '@/lib/cn'

export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const n1Color = tone === 'dark' ? 'text-ivory' : 'text-ink'
  const n2Color = tone === 'dark' ? 'text-faint-on-navy' : 'text-body'

  return (
    <Link href="/" className={cn('group flex items-center gap-[0.7rem]', className)} aria-label="Kingdom E.L.E.C.T. for Africa — home">
      <LogoMark className="h-9 shrink-0" />
      <span className="flex flex-col leading-[1.1]">
        <span className={cn('font-serif text-base font-semibold', n1Color)}>Kingdom E.L.E.C.T.</span>
        <span className={cn('font-sans text-[0.56rem] font-semibold uppercase', n2Color)} style={{ letterSpacing: '0.14em' }}>
          For Africa
        </span>
      </span>
    </Link>
  )
}
