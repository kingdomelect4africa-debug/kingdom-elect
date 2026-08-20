'use client'

import { motion } from 'motion/react'
import { Device } from './Device'

/**
 * Ascending column motif — ties to "The Five Pillars" and the
 * People -> Institutions -> Territories -> Nations -> Generations progression.
 */
export function RisingForms({
  className,
  color = 'currentColor',
  count = 5,
}: {
  className?: string
  color?: string
  count?: number
}) {
  const heights = Array.from({ length: count }, (_, i) => 30 + i * 16)

  return (
    <Device className={className}>
      <svg viewBox="0 0 240 120" className="h-full w-full overflow-visible" fill="none">
        {heights.map((h, i) => (
          <motion.rect
            key={i}
            x={i * 48 + 8}
            width={20}
            initial={{ height: 0, y: 120 }}
            whileInView={{ height: h, y: 120 - h }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            fill={color}
            opacity={0.15 + i * 0.17}
          />
        ))}
      </svg>
    </Device>
  )
}
