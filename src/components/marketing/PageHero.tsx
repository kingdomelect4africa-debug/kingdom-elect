'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { InfluenceLines } from '@/components/devices/InfluenceLines'
import { RisingPillars } from '@/components/devices/RisingPillars'
import { DrawnNetwork } from '@/components/devices/DrawnNetwork'
import { EASE_OUT, SplitWords } from '@/components/motion/primitives'

/** Which brand motif sits behind the headline. */
export type HeroMotif = 'arcs' | 'pillars' | 'network' | 'grid'

/**
 * The opening of every inner page, in the homepage's language: navy, the
 * Kingdom Grid, a brand motif drawing itself in on the right, and a headline
 * set word by word. As the visitor scrolls away the copy lifts and fades a
 * little faster than the page. Pages render it with SetNavTone tone="dark".
 */
export function PageHero({
  id,
  eyebrow,
  title,
  intro,
  motif = 'arcs',
  children,
}: {
  /** Unique per page; names the background pattern. */
  id: string
  eyebrow?: string | null
  title: string
  intro?: string | null
  motif?: HeroMotif
  /** Anything below the intro: facts, filters, links. */
  children?: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 80])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.2])
  const motifY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 50])

  const words = title.split(/\s+/).length
  const after = Math.min(0.25 + words * 0.055, 0.9)

  return (
    <header ref={ref} className="relative isolate overflow-hidden bg-navy text-ivory">
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(90% 90% at 100% 110%, rgba(201,146,24,0.2), transparent 55%), radial-gradient(70% 80% at 0% 0%, rgba(28,59,102,0.55), transparent 65%)',
        }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute inset-0 -z-20 text-ivory [mask-image:radial-gradient(ellipse_65%_80%_at_80%_60%,black,transparent_75%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 2, ease: EASE_OUT }}
        aria-hidden="true"
      >
        <KingdomGrid id={`${id}-grid`} className="h-full w-full" />
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0 -z-10" style={{ y: motifY }} aria-hidden="true">
        {motif === 'arcs' && <InfluenceLines className="absolute bottom-0 right-0 h-full w-[85%] opacity-80 sm:w-[60%] lg:w-[46%]" />}
        {motif === 'pillars' && <RisingPillars className="absolute bottom-0 right-[6%] h-[55%] opacity-70 sm:h-[72%] sm:opacity-100" delay={0.3} />}
        {/* Faded out on the left so the links never run through the headline. */}
        {motif === 'network' && (
          <DrawnNetwork className="absolute inset-0 h-full w-full opacity-60 [mask-image:linear-gradient(90deg,transparent_35%,black_80%)]" />
        )}
        {motif === 'grid' && (
          <motion.div
            className="absolute inset-y-0 right-0 w-[80%] text-gold-light [mask-image:radial-gradient(ellipse_55%_65%_at_72%_58%,black,transparent_72%)] sm:w-[58%]"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2.4, ease: EASE_OUT }}
          >
            <KingdomGrid id={`${id}-motif`} className="h-full w-full" strokeWidth={0.7} />
          </motion.div>
        )}
      </motion.div>

      <motion.div style={{ y: copyY, opacity: copyOpacity }}>
        <Container className="pb-[clamp(3.5rem,8vw,6rem)] pt-[clamp(3.5rem,9vw,6.5rem)]">
          <div className="max-w-[880px]">
            {eyebrow && (
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
              >
                <Kicker onDark>{eyebrow}</Kicker>
              </motion.div>
            )}
            <h1 className="mt-5 font-serif text-[clamp(2.3rem,5.2vw,4.1rem)] font-semibold leading-[1.08] tracking-[-0.015em] text-ivory">
              <SplitWords text={title} delay={0.15} />
            </h1>
            {intro && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: after, ease: EASE_OUT }}
                className="mt-6 max-w-[600px] font-sans text-[1.06rem] leading-[1.8] text-body-on-navy"
              >
                {intro}
              </motion.p>
            )}
            {children && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: after + 0.12, ease: EASE_OUT }}
              >
                {children}
              </motion.div>
            )}
          </div>
        </Container>
      </motion.div>

      <motion.span
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,transparent,rgba(227,185,78,0.5)_30%,rgba(227,185,78,0.5)_70%,transparent)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.8, delay: 0.5, ease: EASE_OUT }}
        aria-hidden="true"
      />
    </header>
  )
}

/**
 * A row of key facts for a page hero (dates, location, capacity...): value
 * above, label below, each separated by a hairline.
 */
export function HeroFacts({ facts }: { facts: { label: string; value: string }[] }) {
  if (facts.length === 0) return null
  return (
    <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-t border-line-navy pt-7">
      {facts.map((fact) => (
        // dt must come first in the markup; flex-col-reverse shows the value on top.
        <div key={fact.label} className="flex flex-col-reverse">
          <dt className="mt-1 font-sans text-[0.66rem] font-semibold uppercase text-faint-on-navy" style={{ letterSpacing: '0.12em' }}>
            {fact.label}
          </dt>
          <dd className="font-serif text-[1.08rem] text-ivory">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
