'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'

type FunctionItem = { title: string; body: string }

export function FunctionsGrid({ functions }: { functions: FunctionItem[] }) {
  return (
    <section className="bg-navy-deep pt-4 pb-[clamp(4.5rem,9vw,8.5rem)] text-ivory">
      <Container>
        <Kicker onDark>What It Functions As</Kicker>
        <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ivory">
          Four functions, one chamber.
        </h2>

        <div className="relative mt-10">
          <div className="grid grid-cols-1 gap-px border border-line-navy bg-line-navy sm:grid-cols-2">
            {functions.map((fn, i) => (
              <motion.div
                key={fn.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-navy p-[2.2rem] transition-colors duration-[0.4s] hover:bg-navy-mid"
              >
                <span className="font-serif text-[0.9rem] text-gold-light">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="mt-[0.9rem] font-serif text-[1.15rem] font-semibold text-ivory">{fn.title}</h4>
                <p className="mt-[0.6rem] font-sans text-[0.88rem] leading-[1.65] text-body-on-navy">{fn.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
