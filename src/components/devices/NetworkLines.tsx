'use client'

import { motion } from 'motion/react'
import { Device } from './Device'

/**
 * Node-and-connector lattice — the "continental network of Kingdom
 * reformers" made visible. Nodes pulse in; connectors draw between them.
 */
export function NetworkLines({
  className,
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  const nodes = [
    [40, 60],
    [140, 20],
    [230, 70],
    [90, 140],
    [200, 160],
    [280, 120],
  ]
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [3, 4],
    [2, 4],
    [4, 5],
    [2, 5],
  ]

  return (
    <Device className={className}>
      <svg viewBox="0 0 320 200" className="h-full w-full overflow-visible" fill="none">
        {edges.map(([a, b], i) => (
          <motion.line
            key={`${a}-${b}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke={color}
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
    </Device>
  )
}
