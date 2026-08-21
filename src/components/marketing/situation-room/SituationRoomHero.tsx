'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'

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
    <header className="bg-navy-deep text-ivory">
      <Container className="pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <Kicker onDark>A Governance Chamber</Kicker>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ivory"
        >
          {heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-5 max-w-[560px] font-sans text-[1.05rem] text-body-on-navy"
        >
          {subheading}
        </motion.p>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-7 max-w-[560px] border-l-2 border-gold pl-6 font-serif text-[clamp(1.05rem,1.8vw,1.3rem)] italic leading-[1.6] text-body-on-navy"
        >
          {philosophy}
        </motion.blockquote>
      </Container>
    </header>
  )
}
