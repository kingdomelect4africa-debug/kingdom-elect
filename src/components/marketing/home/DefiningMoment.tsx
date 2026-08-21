'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'

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
    <section className="bg-ivory py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container>
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            {eyebrow && <Kicker>{eyebrow}</Kicker>}
            <h2 className="mt-4 font-serif text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.12] text-ink">{heading}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-sans text-[1.02rem] leading-[1.85] text-body">{body}</p>

            <div className="mt-8 flex flex-col gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="border-t border-line pt-4">
                  <span className="font-serif text-[2.1rem] font-semibold text-emerald">{stat.value}</span>
                  <span className="mt-1 block font-sans text-[0.82rem] text-body">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
