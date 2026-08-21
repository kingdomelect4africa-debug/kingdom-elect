'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'

export function Statements({
  vision,
  mission,
  purpose,
  essence,
}: {
  vision: string
  mission: string
  purpose: string
  essence: string
}) {
  const rows = [
    { label: 'Vision', text: vision },
    { label: 'Mission', text: mission },
    { label: 'Purpose', text: purpose },
    { label: 'Essence', text: essence },
  ]

  return (
    <section className="bg-navy">
      <Container className="py-[clamp(2rem,4vw,3rem)]">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 items-baseline gap-[0.6rem] border-t border-line-navy py-[2.1rem] last:border-b lg:grid-cols-[0.28fr_0.72fr] lg:gap-8"
          >
            <span className="font-sans text-[0.72rem] font-bold uppercase text-gold-light" style={{ letterSpacing: '0.14em' }}>
              {row.label}
            </span>
            <p className="font-serif text-[clamp(1.05rem,1.8vw,1.35rem)] font-medium leading-[1.5] text-ivory">{row.text}</p>
          </motion.div>
        ))}
      </Container>
    </section>
  )
}
