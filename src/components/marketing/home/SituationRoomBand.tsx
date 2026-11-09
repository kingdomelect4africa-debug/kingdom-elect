'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { EASE_OUT } from '@/components/motion/primitives'

/**
 * The emerald band opens out from an inset, rounded panel to full bleed as it
 * scrolls into view (Motion Identity: "clean wipes"). With reduced motion it
 * is simply full width (the `scroll-fx` rule in globals.css).
 */
export function ExpandingBand({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.15'] })
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(7% 5% 0% 5% round 28px)', 'inset(0% 0% 0% 0% round 0px)'])

  return (
    <motion.div ref={ref} style={{ clipPath }} className={`scroll-fx ${className ?? ''}`}>
      {children}
    </motion.div>
  )
}

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

type Remaining = Record<(typeof UNITS)[number]['key'], number>

function remainingUntil(target: number, now: number): Remaining | null {
  const ms = target - now
  if (ms <= 0) return null
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  }
}

/**
 * Days, hours, minutes and seconds to `startsAt`, ticking live, each digit
 * sliding as it changes. For dark backgrounds. Hidden once the event starts.
 */
export function Countdown({ startsAt, className }: { startsAt: string; className?: string }) {
  // The time is only known in the browser, so the server renders placeholders.
  const [now, setNow] = useState<number | null>(null)
  const target = new Date(startsAt).getTime()

  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const left = now === null ? undefined : remainingUntil(target, now)
  if (left === null) return null

  return (
    <div
      className={`grid grid-cols-4 border-y border-ivory/15 ${className ?? ''}`}
      role="timer"
      aria-label={left ? `${left.days} days, ${left.hours} hours and ${left.minutes} minutes to go` : 'Countdown'}
    >
      {UNITS.map((unit, i) => (
        <div key={unit.key} className={i > 0 ? 'border-l border-ivory/15 py-3 text-center' : 'py-3 text-center'}>
          <div className="relative h-[2.1rem] overflow-hidden font-serif text-[clamp(1.4rem,2.4vw,1.75rem)] font-semibold leading-[2.1rem] text-ivory tabular-nums">
            {left ? (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={left[unit.key]}
                  className="block"
                  initial={{ y: '-100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  {String(left[unit.key]).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            ) : (
              <span className="block text-ivory/40">--</span>
            )}
          </div>
          <div className="mt-1 font-sans text-[0.6rem] font-semibold uppercase text-ivory/55" style={{ letterSpacing: '0.12em' }}>
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * A glass event card. The light under the pointer follows it across the
 * card, and a live countdown runs to the opening session.
 */
export function EventPanel({ startsAt, children, action }: { startsAt: string; children: React.ReactNode; action: React.ReactNode }) {
  const card = useRef<HTMLDivElement>(null)

  function follow(event: React.PointerEvent<HTMLDivElement>) {
    const el = card.current
    if (!el) return
    const box = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${event.clientX - box.left}px`)
    el.style.setProperty('--spot-y', `${event.clientY - box.top}px`)
  }

  return (
    <motion.div
      ref={card}
      onPointerMove={follow}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay: 0.15, ease: EASE_OUT }}
      className="group relative overflow-hidden rounded-[var(--radius-md)] border border-ivory/20 bg-ivory/[0.06] p-[clamp(1.5rem,3vw,2.1rem)] shadow-[inset_0_1px_0_rgba(247,243,234,0.14),0_30px_80px_-30px_rgba(4,12,23,0.6)] backdrop-blur-md"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgba(227,185,78,0.16), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="relative">
        {children}
        <Countdown startsAt={startsAt} className="mt-6" />
        <div className="mt-6">{action}</div>
      </div>
    </motion.div>
  )
}
