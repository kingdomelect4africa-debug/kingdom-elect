'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'

type Stat = { value: string; label: string }

export function DefiningMoment({
  eyebrow,
  heading,
  body,
  stats,
}: {
  eyebrow: string | null
  heading: string
  body: string
  stats: Stat[]
}) {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-serif text-4xl font-medium leading-tight text-brand-primary md:text-5xl"
            >
              {heading}
            </motion.h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-lg leading-relaxed text-ink md:text-xl"
            >
              {body}
            </motion.p>

            <div className="mt-16 grid grid-cols-1 gap-10 border-t border-border-subtle pt-10 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-serif text-4xl font-medium text-brand-secondary">{stat.value}</p>
                  <p className="mt-2 font-sans text-sm leading-snug text-ink-muted">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
