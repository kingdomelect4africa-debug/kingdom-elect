'use client'

import { motion } from 'motion/react'
import { EASE_IN_OUT } from '@/components/motion/primitives'

const ARCS = [150, 230, 310, 390, 470, 550, 630, 710]

/**
 * The brand's "Influence Lines": concentric arcs sweeping out of the
 * bottom-right corner, drawing themselves in once they come into view.
 * For dark backgrounds; every third arc is gold.
 */
export function InfluenceLines({ className, delay = 0.2 }: { className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 800 800" preserveAspectRatio="xMaxYMax slice" className={className} aria-hidden="true">
      {ARCS.map((r, i) => {
        const gold = i % 3 === 1
        return (
          <motion.path
            key={r}
            d={`M${800 - r},800 A${r},${r} 0 0 1 800,${800 - r}`}
            fill="none"
            stroke={gold ? 'var(--color-gold)' : 'var(--color-ivory)'}
            strokeOpacity={gold ? 0.55 : 0.14}
            strokeWidth={gold ? 1.4 : 1}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 2.2, delay: delay + i * 0.09, ease: EASE_IN_OUT }}
          />
        )
      })}
    </svg>
  )
}
