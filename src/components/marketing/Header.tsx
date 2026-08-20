'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Logo } from './Logo'
import { NAV_ITEMS } from './nav-data'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || mobileOpen
          ? 'bg-surface/95 shadow-[0_1px_0_0_var(--color-border-subtle)] backdrop-blur-sm'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-10 lg:px-16">
        <Logo tone="dark" />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'font-sans text-[13px] font-medium uppercase text-ink transition-colors hover:text-brand-accent',
                pathname === item.href && 'text-brand-accent',
              )}
              style={{ letterSpacing: '0.06em' }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/the-situation-room" variant="gold" size="md">
            Join / Register
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span className={cn('h-px w-6 bg-ink transition-transform', mobileOpen && 'translate-y-[3.5px] rotate-45')} />
          <span className={cn('h-px w-6 bg-ink transition-transform', mobileOpen && '-translate-y-[3.5px] -rotate-45')} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-surface lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="border-b border-border-subtle py-4 font-serif text-lg text-brand-primary"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-6">
                <Button href="/the-situation-room" variant="gold" size="md" className="w-full">
                  Join / Register
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
