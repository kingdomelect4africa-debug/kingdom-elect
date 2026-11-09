'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { EASE_OUT, Reveal } from '@/components/motion/primitives'
import { cn } from '@/lib/cn'

const LETTERS = [
  { letter: 'E', word: 'Educators' },
  { letter: 'L', word: 'Leaders' },
  { letter: 'E', word: 'Entrepreneurs' },
  { letter: 'C', word: 'Creatives' },
  { letter: 'T', word: 'Technocrats' },
]

export function StoryAcronym({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="bg-ivory py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container>
        <div className="grid grid-cols-1 gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-[1.12] text-ink">{heading}</h2>
            <p className="mt-[1.1rem] font-sans leading-[1.85] text-body">{body}</p>
          </Reveal>

          {/* The acronym spells itself out, one sphere at a time. */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 lg:flex-nowrap lg:justify-between lg:gap-2">
            {LETTERS.map((item, i) => (
              <motion.div
                key={i}
                className="group text-center"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE_OUT }}
              >
                <span
                  className={cn(
                    'block font-serif text-[clamp(2.6rem,6.4vw,4.6rem)] font-semibold leading-none transition-transform duration-500 ease-[var(--ease-signature)] group-hover:-translate-y-1.5',
                    i % 3 === 2 ? 'text-emerald' : 'text-gold',
                  )}
                >
                  {item.letter}
                </span>
                <motion.span
                  className="mx-auto mt-3 block h-px w-8 origin-left bg-gold/60"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: EASE_OUT }}
                  aria-hidden="true"
                />
                <span className="mt-2 block font-sans text-[0.62rem] uppercase text-body" style={{ letterSpacing: '0.08em' }}>
                  {item.word}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
