'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'

export function Personality({ traits }: { traits: string[] }) {
  return (
    <section className="bg-ivory-dim py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container className="text-center">
        <Kicker center>The Experience</Kicker>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-serif text-[clamp(1.3rem,2.8vw,2rem)] font-medium leading-[1.6] text-ink"
        >
          {traits.map((trait, i) => (
            <span key={i}>
              <span className={i % 3 === 1 ? 'italic text-gold-dark' : undefined}>{trait}</span>
              {i < traits.length - 1 && ' · '}
            </span>
          ))}
        </motion.p>
      </Container>
    </section>
  )
}
