'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'

type Objective = { title: string; body: string }

export function Objectives({ objectives }: { objectives: Objective[] }) {
  return (
    <section className="bg-ivory py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container>
        <div className="max-w-[600px]">
          <Kicker>Objectives</Kicker>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1.12] text-ink">
            Six commitments, one mandate.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px border border-line bg-line lg:grid-cols-2">
          {objectives.map((objective, i) => (
            <motion.div
              key={objective.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-ivory px-[2.2rem] py-8"
            >
              <span className="font-serif text-[0.95rem] font-semibold text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-[0.8rem] font-serif text-[1.05rem] font-semibold leading-snug text-ink">{objective.title}</h3>
              <p className="mt-[0.55rem] font-sans text-[0.88rem] leading-[1.6] text-body">{objective.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
