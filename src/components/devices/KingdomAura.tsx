'use client'

import { motion } from 'motion/react'
import { EASE_IN_OUT, EASE_OUT } from '@/components/motion/primitives'

/**
 * Bespoke abstract illustration: a soft, slowly drifting gradient glow
 * (gold/emerald/navy-light) beneath fine concentric orbit rings and node
 * points. Stands in for photography in the About and Situation Room heroes,
 * in the same device family as KingdomGrid and the Influence Lines.
 *
 * On arrival the rings draw themselves, the spokes reach out to their nodes
 * and the centre radiates; afterwards the outer orbit turns very slowly.
 */
export function KingdomAura({ className, tone = 'navy' }: { className?: string; tone?: 'navy' | 'deep' }) {
  const ringStroke = tone === 'deep' ? 'rgba(247,243,234,0.16)' : 'rgba(247,243,234,0.14)'
  const ringStrokeBright = tone === 'deep' ? 'rgba(217,179,93,0.55)' : 'rgba(217,179,93,0.48)'

  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1.8, delay, ease: EASE_IN_OUT },
  })
  const pop = (delay: number) => ({
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
    className: 'origin-center [transform-box:fill-box]',
  })

  return (
    <div className={className} style={{ position: 'absolute', overflow: 'hidden' }} aria-hidden="true">
      <div
        className="absolute inset-[-20%] animate-[mediashift_16s_ease_infinite]"
        style={{
          backgroundImage: `
            radial-gradient(28% 28% at 80% 20%, rgba(201,146,24,0.5) 0%, rgba(201,146,24,0) 68%),
            radial-gradient(24% 24% at 15% 82%, rgba(18,60,42,0.55) 0%, rgba(18,60,42,0) 70%),
            radial-gradient(55% 55% at 50% 50%, rgba(28,59,102,0.32) 0%, rgba(28,59,102,0) 78%)
          `,
          backgroundSize: '220% 220%',
          filter: 'blur(48px)',
        }}
      />

      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g className="origin-[60px_44px] motion-safe:animate-[spin-slow_90s_linear_infinite]">
          <motion.circle cx="60" cy="44" r="36" fill="none" stroke={ringStroke} strokeWidth="0.25" {...draw(0.1)} />
          <motion.circle cx="96" cy="44" r="0.9" fill="var(--color-gold-300)" {...pop(1.6)} />
        </g>
        <motion.circle cx="60" cy="44" r="25" fill="none" stroke={ringStroke} strokeWidth="0.25" {...draw(0.3)} />
        <motion.circle cx="60" cy="44" r="14.5" fill="none" stroke={ringStrokeBright} strokeWidth="0.35" {...draw(0.5)} />

        <motion.line x1="60" y1="44" x2="88" y2="24" stroke={ringStrokeBright} strokeWidth="0.2" {...draw(1)} />
        <motion.line x1="60" y1="44" x2="27" y2="60" stroke={ringStroke} strokeWidth="0.2" {...draw(1.15)} />
        <motion.line x1="60" y1="44" x2="46" y2="12" stroke={ringStroke} strokeWidth="0.2" {...draw(1.3)} />

        <circle
          cx="60"
          cy="44"
          r="2.4"
          fill="none"
          stroke="var(--color-gold-300)"
          strokeWidth="0.3"
          className="origin-center [transform-box:fill-box] motion-safe:animate-[radiate_3.6s_ease-out_infinite]"
        />
        <motion.circle cx="60" cy="44" r="2.4" fill="var(--color-gold-300)" {...pop(0.2)} />
        <motion.circle cx="88" cy="24" r="1.2" fill="var(--color-gold-300)" fillOpacity="0.9" {...pop(1.9)} />
        <motion.circle cx="27" cy="60" r="1" fill="var(--color-ivory)" fillOpacity="0.55" {...pop(2.05)} />
        <motion.circle cx="46" cy="12" r="0.9" fill="var(--color-ivory)" fillOpacity="0.5" {...pop(2.2)} />
        <motion.circle cx="82" cy="70" r="1.1" fill="var(--color-ivory)" fillOpacity="0.4" {...pop(2.3)} />
        <motion.circle cx="18" cy="30" r="0.8" fill="var(--color-ivory)" fillOpacity="0.4" {...pop(2.4)} />
      </svg>
    </div>
  )
}
