'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'

type FunctionItem = { title: string; body: string }

export function FunctionsGrid({ functions }: { functions: FunctionItem[] }) {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <Eyebrow>What It Functions As</Eyebrow>
        <h2 className="mt-5 max-w-xl font-serif text-4xl font-medium leading-tight text-brand-primary md:text-5xl">
          Four functions, one chamber.
        </h2>

        <div className="mt-16 grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
          {functions.map((fn, i) => (
            <motion.div
              key={fn.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-surface p-10"
            >
              <span className="font-serif text-2xl text-brand-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-serif text-2xl font-medium text-brand-primary">{fn.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">{fn.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
