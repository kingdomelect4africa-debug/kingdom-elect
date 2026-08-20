'use client'

import { motion } from 'motion/react'
import { Device } from './Device'

/**
 * Radial sunburst anchored at a corner — Africa as a center from which
 * influence radiates outward. Low-opacity, decorative, never load-bearing
 * for content.
 */
export function RadiatingLines({
  className,
  color = 'currentColor',
  lines = 24,
  origin = 'top-right',
}: {
  className?: string
  color?: string
  lines?: number
  origin?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}) {
  const cx = origin.includes('right') ? 400 : 0
  const cy = origin.includes('bottom') ? 400 : 0

  return (
    <Device className={className}>
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" fill="none">
        {Array.from({ length: lines }, (_, i) => {
          const angle = (i / lines) * (Math.PI / 2) + (origin.includes('right') ? Math.PI : origin.includes('bottom') ? Math.PI / 2 : 0)
          const length = 90 + (i % 4) * 40
          const x2 = cx + Math.cos(angle) * length
          const y2 = cy + Math.sin(angle) * length
          return (
            <motion.line
              key={i}
              x1={cx}
              y1={cy}
              stroke={color}
              strokeWidth={1}
              opacity={0.25}
              initial={{ x2: cx, y2: cy }}
              whileInView={{ x2, y2 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: i * 0.015, ease: [0.16, 1, 0.3, 1] }}
            />
          )
        })}
      </svg>
    </Device>
  )
}
