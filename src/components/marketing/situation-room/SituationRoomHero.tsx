'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { RadiatingLines } from '@/components/devices/RadiatingLines'

export function SituationRoomHero({
  heading,
  subheading,
  philosophy,
}: {
  heading: string
  subheading: string
  philosophy: string
}) {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-navy-900 text-ink-inverse">
      <RadiatingLines className="absolute -bottom-40 -left-40 h-[560px] w-[560px] text-white" origin="bottom-left" lines={22} />
      <Container className="relative z-10 pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-sans text-xs font-semibold uppercase text-brand-accent"
          style={{ letterSpacing: 'var(--tracking-label)' }}
        >
          A Governance Chamber
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
        >
          {heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-7 max-w-xl font-sans text-lg leading-relaxed text-ivory-500/85 md:text-xl"
        >
          {subheading}
        </motion.p>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 max-w-2xl border-l-2 border-brand-accent pl-6 font-serif text-2xl italic leading-snug text-ivory-500/95"
        >
          {philosophy}
        </motion.blockquote>
      </Container>
    </section>
  )
}
