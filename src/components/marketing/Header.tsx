'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Logo } from './Logo'
import { NAV_ITEMS } from './nav-data'
import { useNavTone } from './NavTone'
import { cn } from '@/lib/cn'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const tone = useNavTone()
  const onDark = tone === 'dark' && !mobileOpen

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between border-b px-[clamp(1.5rem,5vw,4rem)] py-4 backdrop-blur-[10px] transition-colors duration-400',
        onDark ? 'border-line-navy bg-navy/88' : 'border-line bg-ivory/90',
      )}
    >
      <Logo tone={onDark ? 'dark' : 'light'} />

      <nav className="hidden items-center gap-[1.9rem] lg:flex">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'relative font-sans text-[0.74rem] font-semibold uppercase transition-colors',
                onDark ? 'text-body-on-navy hover:text-ivory' : 'text-body hover:text-ink',
                active && (onDark ? 'text-ivory' : 'text-ink'),
              )}
              style={{ letterSpacing: '0.06em' }}
            >
              {item.label}
              {active && (
                <span
                  className="absolute inset-x-0 -bottom-1.5 h-px bg-gold"
                  aria-hidden="true"
                />
              )}
            </a>
          )
        })}
      </nav>

      <a
        href="/the-situation-room"
        className={cn(
          'hidden rounded-[var(--radius-sm)] px-[1.3rem] py-[0.6rem] font-sans text-[0.72rem] font-semibold uppercase transition-colors lg:inline-block',
          onDark ? 'bg-gold text-navy-deep hover:bg-gold-light' : 'bg-navy text-ivory hover:bg-gold hover:text-navy-deep',
        )}
        style={{ letterSpacing: '0.06em' }}
      >
        Join / Register
      </a>

      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center lg:hidden"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <span className="relative block h-[1.5px] w-[18px]">
          <span
            className={cn(
              'absolute left-0 top-0 h-[1.5px] w-[18px] transition-transform duration-300',
              onDark || mobileOpen ? 'bg-ivory' : 'bg-ink',
              mobileOpen ? 'translate-y-[6px] rotate-45' : '-translate-y-1.5',
            )}
          />
          <span
            className={cn(
              'absolute left-0 top-0 h-[1.5px] w-[18px] transition-opacity duration-300',
              onDark || mobileOpen ? 'bg-ivory' : 'bg-ink',
              mobileOpen && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'absolute left-0 top-0 h-[1.5px] w-[18px] transition-transform duration-300',
              onDark || mobileOpen ? 'bg-ivory' : 'bg-ink',
              mobileOpen ? '-translate-y-[6px] -rotate-45' : 'translate-y-1.5',
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[66px] bottom-0 z-40 flex flex-col justify-center gap-2 bg-navy-deep p-8 lg:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="p-3 font-serif text-[1.3rem] text-ivory"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/the-situation-room"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-block rounded-[var(--radius-sm)] bg-gold px-6 py-3 text-center font-sans text-[0.72rem] font-semibold uppercase text-navy-deep"
              style={{ letterSpacing: '0.06em' }}
            >
              Join / Register
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
