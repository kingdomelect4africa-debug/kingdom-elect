'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'

type Step = { label: string; description: string }

export function KingdomFramework({
  heading,
  intro,
  steps,
}: {
  heading: string
  intro: string
  steps: Step[]
}) {
  return (
    <section className="relative overflow-hidden bg-brand-primary py-24 text-ink-inverse md:py-32">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The Kingdom Framework</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight md:text-5xl">{heading}</h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ivory-500/85">{intro}</p>
        </div>

        <div className="relative mt-20">
          <svg
            viewBox="0 0 1000 4"
            preserveAspectRatio="none"
            className="absolute left-0 top-[22px] hidden h-px w-full lg:block"
          >
            <motion.line
              x1={20}
              y1={2}
              x2={980}
              y2={2}
              stroke="var(--color-brand-accent)"
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-accent font-serif text-lg text-brand-accent">
                    {i + 1}
                  </span>
                  <h3 className="font-serif text-xl font-medium">{step.label}</h3>
                </div>
                <p className="mt-4 font-sans text-sm leading-relaxed text-ivory-500/75">{step.description}</p>
                {i < steps.length - 1 && (
                  <span className="mt-6 block h-px w-10 bg-white/15 lg:hidden" aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
