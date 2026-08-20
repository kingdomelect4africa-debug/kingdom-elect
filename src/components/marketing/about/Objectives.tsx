'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'

type Objective = { title: string; body: string }

export function Objectives({ objectives }: { objectives: Objective[] }) {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <Eyebrow>Objectives</Eyebrow>
        <h2 className="mt-5 max-w-xl font-serif text-4xl font-medium leading-tight text-brand-primary md:text-5xl">
          Six commitments, one mandate.
        </h2>

        <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {objectives.map((objective, i) => (
            <motion.div
              key={objective.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-6 border-t border-border-subtle pt-6"
            >
              <span className="font-serif text-3xl text-brand-accent">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-serif text-xl font-medium leading-snug text-brand-primary">{objective.title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">{objective.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
