'use client'

import Image from 'next/image'
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
        <div className="grid items-center gap-[clamp(2.5rem,6vw,4rem)] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
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
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-line-navy"
          >
            {/* NASA Black Marble — Africa's city lights at night; public domain */}
            <Image src="/brand/africa-night.jpg" alt="Africa at night, city lights seen from space" fill sizes="(min-width: 1024px) 40vw, 90vw" style={{ objectFit: 'cover' }} />
          </motion.div>
        </div>
      </Container>
    </header>
  )
}
