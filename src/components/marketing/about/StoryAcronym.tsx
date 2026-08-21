'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
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
    <section className="bg-ivory pt-4 pb-[clamp(4.5rem,9vw,8.5rem)]">
      <Container>
        <div className="grid grid-cols-1 gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.12] text-ink">{heading}</h2>
            <p className="mt-[1.1rem] font-sans leading-[1.85] text-body">{body}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-6 lg:flex-nowrap lg:justify-between lg:gap-2"
          >
            {LETTERS.map((item, i) => (
              <div key={i} className="text-center">
                <span
                  className={cn(
                    'font-serif text-[clamp(2.4rem,6vw,4.2rem)] font-semibold',
                    i % 3 === 2 ? 'text-emerald' : 'text-gold',
                  )}
                >
                  {item.letter}
                </span>
                <span className="mt-2 block font-sans text-[0.62rem] uppercase text-body" style={{ letterSpacing: '0.08em' }}>
                  {item.word}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
