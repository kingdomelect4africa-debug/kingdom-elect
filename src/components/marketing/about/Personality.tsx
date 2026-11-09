'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { EASE_OUT } from '@/components/motion/primitives'

/** The experience in a line of traits, each rising into place in turn. */
export function Personality({ traits }: { traits: string[] }) {
  return (
    <section className="bg-ivory-dim py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container className="text-center">
        <Kicker center>The Experience</Kicker>
        <motion.p
          className="mx-auto mt-7 max-w-[1000px] font-serif text-[clamp(1.4rem,3vw,2.2rem)] font-medium leading-[1.6] text-ink"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.09 }}
        >
          {traits.map((trait, i) => (
            <span key={i}>
              <motion.span
                className={i % 3 === 1 ? 'inline-block italic text-gold-dark' : 'inline-block'}
                variants={{ hidden: { opacity: 0, y: 22, filter: 'blur(4px)' }, shown: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              >
                {trait}
              </motion.span>
              {i < traits.length - 1 && <span className="text-gold/70"> · </span>}
            </span>
          ))}
        </motion.p>
      </Container>
    </section>
  )
}
