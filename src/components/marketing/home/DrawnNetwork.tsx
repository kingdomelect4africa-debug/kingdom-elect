'use client'

import { motion } from 'motion/react'
import { EASE_IN_OUT, EASE_OUT } from '@/components/motion/primitives'

// The "continental network of reformers" motif: links draw themselves, then
// each node lights up as its first link reaches it. Two clusters frame the
// copy without running through it.
const NODES: [number, number, number][] = [
  [120, 90, 3],
  [330, 210, 4],
  [200, 410, 2.5],
  [60, 300, 2.5],
  [890, 100, 3],
  [1010, 270, 4],
  [1130, 140, 3],
  [920, 430, 2.5],
]

const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [4, 5],
  [5, 6],
  [5, 7],
  [4, 6],
]

export function DrawnNetwork({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {LINKS.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="var(--color-line-navy-strong)"
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, delay: 0.2 + i * 0.18, ease: EASE_IN_OUT }}
        />
      ))}
      {NODES.map(([x, y, r], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill="var(--color-gold-light)"
          className="origin-center [transform-box:fill-box]"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.16, ease: EASE_OUT }}
        />
      ))}
    </svg>
  )
}
