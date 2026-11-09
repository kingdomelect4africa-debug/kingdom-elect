'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { CountUp, Reveal } from '@/components/motion/primitives'
import { AfricaConnect } from './AfricaConnect'

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
  const mapColumn = useRef<HTMLDivElement>(null)
  const manifesto = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress: mapProgress } = useScroll({ target: mapColumn, offset: ['start 0.85', 'end 0.65'] })
  const { scrollYProgress: readProgress } = useScroll({ target: manifesto, offset: ['start 0.82', 'end 0.42'] })
  const words = body.split(/\s+/).filter(Boolean)

  return (
    // overflow-x-clip, not overflow-hidden: the map column needs position: sticky.
    <section className="relative overflow-x-clip bg-ivory py-[clamp(5rem,10vw,9rem)]">
      <Container>
        <div className="grid gap-[clamp(3rem,6vw,6rem)] lg:grid-cols-[0.95fr_1.05fr]">
          <div ref={mapColumn} className="order-2 lg:order-1">
            <div className="mx-auto max-w-[460px] lg:sticky lg:top-[calc(50vh-15rem)] lg:max-w-none">
              <AfricaConnect progress={mapProgress} className="h-auto w-full overflow-visible" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal>
              {eyebrow && <Kicker>{eyebrow}</Kicker>}
              <h2 className="mt-4 max-w-[560px] font-serif text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12] text-ink">{heading}</h2>
            </Reveal>

            {/* The statement lights up word by word as it is read (shown whole with reduced motion: scroll-fx-children). */}
            <p
              ref={manifesto}
              className="scroll-fx-children mt-8 font-serif text-[clamp(1.3rem,2.15vw,1.8rem)] font-normal leading-[1.5] tracking-[-0.005em] text-ink"
            >
              {words.map((word, i) => {
                const start = (i / words.length) * 0.85
                return <Word key={i} word={word} progress={readProgress} range={[start, start + 0.15]} last={i === words.length - 1} />
              })}
            </p>

            {stats.length > 0 && (
              <div className="mt-14 grid grid-cols-1 gap-y-8 border-t border-line pt-8 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
                {stats.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.12} className="sm:border-l sm:border-line sm:px-6 sm:first:border-l-0 sm:first:pl-0">
                    <div className="font-serif text-[clamp(2.4rem,4vw,3.2rem)] font-semibold leading-none text-emerald">
                      <CountUp value={stat.value} />
                    </div>
                    <p className="mt-3 max-w-[16rem] font-sans text-[0.84rem] leading-[1.6] text-body">{stat.label}</p>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

function Word({ word, progress, range, last }: { word: string; progress: MotionValue<number>; range: [number, number]; last: boolean }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>
      {!last && ' '}
    </>
  )
}
