'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import { AFRICA_BORDERS, AFRICA_HUBS, AFRICA_OUTLINE, AFRICA_VIEWBOX } from './africa-map-data'

/**
 * The brand's "Africa Connect" pattern, driven by scroll: the coastline draws
 * itself, the borders surface, then gold lines reach out from Abuja (home of
 * the Situation Room) to capitals across the continent.
 *
 * `progress` runs 0 → 1 as the visitor scrolls through the section. With
 * reduced motion the map is simply shown whole (the `scroll-fx-children` rule in
 * globals.css).
 */
export function AfricaConnect({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const coastline = useTransform(progress, [0, 0.38], [0.001, 1])
  const borders = useTransform(progress, [0.18, 0.5], [0, 1])
  const landFill = useTransform(progress, [0.25, 0.6], [0, 1])
  const [abuja, ...hubs] = AFRICA_HUBS
  const hubWindow = 0.5 / hubs.length

  return (
    <svg viewBox={AFRICA_VIEWBOX} className={`scroll-fx-children ${className ?? ''}`} role="img" aria-label="Map of Africa, with capitals across the continent connected to Abuja">
      <motion.path d={AFRICA_OUTLINE} fill="var(--color-navy)" fillOpacity={0.045} style={{ opacity: landFill }} />
      <motion.path
        d={AFRICA_BORDERS}
        fill="none"
        stroke="var(--color-navy)"
        strokeOpacity={0.16}
        strokeWidth={0.6}
        strokeLinejoin="round"
        style={{ opacity: borders }}
      />
      <motion.path
        d={AFRICA_OUTLINE}
        fill="none"
        stroke="var(--color-navy)"
        strokeOpacity={0.7}
        strokeWidth={1.1}
        strokeLinejoin="round"
        style={{ pathLength: coastline }}
      />

      {hubs.map((hub, i) => (
        <Connection key={hub.name} from={abuja} to={hub} progress={progress} start={0.4 + i * hubWindow} />
      ))}

      {/* Abuja: the convening point, with a pulse radiating from it. */}
      <g>
        <circle
          cx={abuja.x}
          cy={abuja.y}
          r={7}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth={1}
          className="origin-center [transform-box:fill-box] motion-safe:animate-[radiate_3.2s_ease-out_infinite]"
        />
        <circle cx={abuja.x} cy={abuja.y} r={4.2} fill="var(--color-gold)" />
        <circle cx={abuja.x} cy={abuja.y} r={1.6} fill="var(--color-ivory)" />
        <text
          x={abuja.x + 9}
          y={abuja.y - 6}
          className="fill-ink font-sans text-[9px] font-semibold uppercase"
          style={{ letterSpacing: '0.12em', paintOrder: 'stroke' }}
          stroke="var(--color-ivory)"
          strokeWidth={3}
        >
          Abuja
        </text>
      </g>
    </svg>
  )
}

function Connection({
  from,
  to,
  progress,
  start,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  progress: MotionValue<number>
  start: number
}) {
  const draw = useTransform(progress, [start, start + 0.12], [0.001, 1])
  const arrive = useTransform(progress, [start + 0.08, start + 0.14], [0, 1])

  // A gentle arc: the control point sits off the midpoint, perpendicular to the line.
  const dx = to.x - from.x
  const dy = to.y - from.y
  const bend = 0.22
  const cx = (from.x + to.x) / 2 - dy * bend
  const cy = (from.y + to.y) / 2 + dx * bend

  return (
    <g>
      <motion.path
        d={`M${from.x},${from.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${to.x},${to.y}`}
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeOpacity={0.85}
        style={{ pathLength: draw }}
      />
      <motion.circle cx={to.x} cy={to.y} r={2.6} fill="var(--color-gold)" style={{ scale: arrive, opacity: arrive }} className="origin-center [transform-box:fill-box]" />
    </g>
  )
}
