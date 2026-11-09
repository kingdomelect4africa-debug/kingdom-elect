'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { KingdomAura } from '@/components/devices/KingdomAura'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { EASE_OUT, SplitWords } from '@/components/motion/primitives'

export function SituationRoomHero({
  heading,
  subheading,
  philosophy,
}: {
  heading: string
  subheading: string
  philosophy: string
}) {
  const after = Math.min(0.25 + heading.split(/\s+/).length * 0.055, 0.9)

  return (
    <header className="relative isolate overflow-hidden bg-navy-deep text-ivory">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(80% 90% at 100% 100%, rgba(201,146,24,0.14), transparent 60%)' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute inset-0 -z-10 text-ivory [mask-image:radial-gradient(ellipse_60%_70%_at_20%_40%,black,transparent_75%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 2 }}
        aria-hidden="true"
      >
        <KingdomGrid id="situation-room-hero-grid" className="h-full w-full" />
      </motion.div>

      <Container className="pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(3.5rem,8vw,5.5rem)]">
        <div className="grid items-center gap-[clamp(2.5rem,6vw,4rem)] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}>
              <Kicker onDark>A Governance Chamber</Kicker>
            </motion.div>
            <h1 className="mt-5 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.9rem)] font-semibold leading-[1.08] tracking-[-0.015em] text-ivory">
              <SplitWords text={heading} delay={0.15} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: after, ease: EASE_OUT }}
              className="mt-6 max-w-[560px] font-sans text-[1.06rem] leading-[1.75] text-body-on-navy"
            >
              {subheading}
            </motion.p>
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: after + 0.15, ease: EASE_OUT }}
              className="relative mt-8 max-w-[560px] pl-6 font-serif text-[clamp(1.05rem,1.8vw,1.3rem)] italic leading-[1.6] text-body-on-navy"
            >
              <motion.span
                className="absolute bottom-0 left-0 top-0 w-[2px] origin-top bg-gold"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.1, delay: after + 0.3, ease: EASE_OUT }}
                aria-hidden="true"
              />
              {philosophy}
            </motion.blockquote>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE_OUT }}
            className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-line-navy bg-navy-deep shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]"
          >
            <KingdomAura className="inset-0" tone="deep" />
          </motion.div>
        </div>
      </Container>
    </header>
  )
}
