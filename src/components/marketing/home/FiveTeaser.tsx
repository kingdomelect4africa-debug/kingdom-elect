'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { cn } from '@/lib/cn'

type Pillar = { key: string; name: string; tagline: string; letter: string }

const PILLARS: Pillar[] = [
  { key: 'EDUCATOR', name: 'Educators', letter: 'E', tagline: 'Shaping minds. Raising solutions.' },
  { key: 'LEADER', name: 'Leaders', letter: 'L', tagline: 'Stewarding influence. Driving change.' },
  { key: 'ENTREPRENEUR', name: 'Entrepreneurs', letter: 'E', tagline: 'Building value. Creating opportunities.' },
  { key: 'CREATIVE', name: 'Creatives', letter: 'C', tagline: 'Shaping culture. Communicating truth.' },
  { key: 'TECHNOCRAT', name: 'Technocrats', letter: 'T', tagline: 'Designing systems. Building the future.' },
]

export function FiveTeaser({ heading, intro }: { heading: string; intro: string }) {
  const [active, setActive] = useState(2)

  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Collective Influence</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-brand-primary md:text-5xl">
            {heading}
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted">{intro}</p>
        </div>

        <div className="mt-16 flex h-[520px] flex-col gap-2 overflow-hidden rounded-none md:h-[440px] md:flex-row">
          {PILLARS.map((pillar, i) => (
            <motion.button
              key={pillar.key}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn(
                'relative flex flex-col justify-between overflow-hidden text-left transition-[flex-basis] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                active === i ? 'bg-brand-primary' : 'bg-navy-50',
              )}
              style={{
                flexBasis: active === i ? '40%' : '15%',
                flexGrow: 0,
                flexShrink: 0,
              }}
              aria-pressed={active === i}
            >
              <span
                className={cn(
                  'p-6 font-serif text-5xl transition-colors md:text-6xl',
                  active === i ? 'text-brand-accent' : 'text-navy-300',
                )}
              >
                {pillar.letter}
              </span>

              <div className="p-6">
                <p
                  className={cn(
                    'font-sans text-xs font-semibold uppercase transition-colors',
                    active === i ? 'text-ivory-500' : 'text-navy-400',
                  )}
                  style={{ letterSpacing: 'var(--tracking-label)' }}
                >
                  {pillar.name}
                </p>

                {active === i && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-ivory-500/80"
                  >
                    {pillar.tagline}
                  </motion.p>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/the-five"
            className="font-sans text-sm font-semibold uppercase text-brand-primary underline-offset-4 hover:underline"
            style={{ letterSpacing: 'var(--tracking-label)' }}
          >
            Explore The Five in depth →
          </Link>
        </div>
      </Container>
    </section>
  )
}
