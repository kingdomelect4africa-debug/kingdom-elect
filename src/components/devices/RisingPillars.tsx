'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { EASE_OUT } from '@/components/motion/primitives'
import { cn } from '@/lib/cn'

const HEIGHTS = [22, 38, 54, 72, 94]

/**
 * The five gold pillars of the brand mark rising from their foundation
 * (logo animation: "Build"), then breathing gently. The caller positions and
 * sizes the row; the pillars fill its height.
 */
export function RisingPillars({
  className,
  delay = 0.5,
  inView = false,
}: {
  className?: string
  delay?: number
  /** Rise when scrolled into view rather than on page load. */
  inView?: boolean
}) {
  // Watch the row, not the bars: a bar squashed to nothing has no area to be seen.
  const row = useRef<HTMLDivElement>(null)
  const seen = useInView(row, { once: true, amount: 0.3 })
  const rise = !inView || seen
  return (
    <div ref={row} className={cn('flex items-end gap-[clamp(6px,1vw,14px)]', className)} aria-hidden="true">
      {HEIGHTS.map((height, i) => (
        <motion.span
          key={height}
          className="block w-[clamp(6px,1.1vw,16px)] origin-bottom"
          style={{ height: `${height}%` }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={rise ? { scaleY: 1, opacity: 0.9 } : undefined}
          transition={{ duration: 1.5, delay: delay + i * 0.13, ease: EASE_OUT }}
        >
          <span
            className="block h-full w-full origin-bottom rounded-t-[2px]"
            style={{
              background: 'linear-gradient(180deg, var(--color-gold-light), var(--color-gold) 70%, transparent)',
              animation: `pillar-breathe 4.6s ease-in-out ${delay + 1.9 + i * 0.25}s infinite`,
            }}
          />
        </motion.span>
      ))}
    </div>
  )
}
