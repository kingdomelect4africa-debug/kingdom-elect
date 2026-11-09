'use client'

import { Fragment, useEffect, useRef } from 'react'
import { animate, motion, MotionConfig, useInView, useScroll } from 'motion/react'
import { cn } from '@/lib/cn'

/**
 * Shared motion for the public site, following the brand's Motion Identity
 * sheet: elements enter by fading up with a soft ease, medium moves take
 * 0.6–1.2s and cinematic ones 1.2–2s. Nothing here loops for show.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

/**
 * Wrap a page in this so every motion component below honours the visitor's
 * "reduce motion" setting: movement is dropped and only gentle fades remain.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  amount = 0.25,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  amount?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Sets a headline word by word, each word rising out of its own mask. Works
 * on any CMS text. The padding keeps descenders (g, y, p) from being clipped
 * by the mask; the matching negative margin keeps the line height unchanged.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  inView = false,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  /** Start when scrolled into view rather than on page load. */
  inView?: boolean
}) {
  const words = text.split(/\s+/).filter(Boolean)
  // Watch the whole line rather than each word: a word waiting below its
  // mask is clipped out of sight, so on its own it would never count as seen.
  const line = useRef<HTMLSpanElement>(null)
  const seen = useInView(line, { once: true, amount: 0.5 })
  const show = !inView || seen
  return (
    <span ref={line}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-top">
            <motion.span
              className={cn('inline-block will-change-transform', className)}
              initial={{ y: '110%' }}
              animate={show ? { y: '0%' } : undefined}
              transition={{ duration: 1.05, delay: delay + i * stagger, ease: EASE_OUT }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}

/** "1.5B+" → { prefix: '', number: 1.5, decimals: 1, suffix: 'B+' } */
function parseFigure(value: string) {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, digits, suffix] = match
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0
  return { prefix, number: Number(digits.replace(/,/g, '')), decimals, suffix, grouped: digits.includes(',') }
}

/**
 * Counts a figure such as "54" or "1.5B+" up from zero when it scrolls into
 * view. The server renders the real figure, so it reads correctly without
 * JavaScript; text that isn't a number is shown as it is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })

  useEffect(() => {
    const el = ref.current
    const figure = parseFigure(value)
    if (!el || !figure) return
    const format = (n: number) =>
      figure.prefix +
      n.toLocaleString('en-US', {
        minimumFractionDigits: figure.decimals,
        maximumFractionDigits: figure.decimals,
        useGrouping: figure.grouped,
      }) +
      figure.suffix

    if (!inView) {
      // Below the fold: park it at zero, ready to count when it arrives.
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.textContent = format(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = value
      return
    }
    const controls = animate(0, figure.number, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (n) => {
        el.textContent = format(n)
      },
      onComplete: () => {
        el.textContent = value
      },
    })
    return () => {
      controls.stop()
      el.textContent = value
    }
  }, [inView, value])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {value}
    </span>
  )
}

/**
 * Lets every `.spotlight` card inside it carry a soft gold light that
 * follows the pointer (the glow itself is CSS, in globals.css). One listener
 * for the whole group, so the cards themselves can stay server-rendered.
 */
export function SpotlightGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  function follow(event: React.PointerEvent<HTMLDivElement>) {
    const card = (event.target as HTMLElement).closest<HTMLElement>('.spotlight')
    if (!card) return
    const box = card.getBoundingClientRect()
    card.style.setProperty('--spot-x', `${event.clientX - box.left}px`)
    card.style.setProperty('--spot-y', `${event.clientY - box.top}px`)
  }
  return (
    <div className={className} onPointerMove={follow}>
      {children}
    </div>
  )
}

/** A thin gold bar along the top of the window showing how far through the page the reader is. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  )
}
