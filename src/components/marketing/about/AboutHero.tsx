'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { KingdomAura } from '@/components/devices/KingdomAura'

export function AboutHero({ heading, body }: { heading: string; body: string }) {
  return (
    <header className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
      <Container>
        <div className="grid items-center gap-[clamp(2.5rem,6vw,4rem)] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <Kicker>About Kingdom E.L.E.C.T.</Kicker>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.01em] text-ink"
            >
              {heading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-[560px] font-sans text-[1.05rem] leading-[1.6] text-body"
            >
              {body}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-line bg-navy"
          >
            <KingdomAura className="inset-0" tone="navy" />
          </motion.div>
        </div>
      </Container>
    </header>
  )
}
