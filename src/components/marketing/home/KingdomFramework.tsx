'use client'

import { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { cn } from '@/lib/cn'

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
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = stepRefs.current.findIndex((el) => el === entry.target)
          if (idx !== -1) setActiveIndex(idx)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [steps.length])

  return (
    <section className="bg-navy py-[clamp(4.5rem,9vw,8.5rem)] text-ivory">
      <Container>
        <div className="grid gap-[clamp(2rem,6vw,5rem)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-28 lg:h-fit lg:self-start">
            <Kicker onDark>The Kingdom Principle</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ivory">{heading}</h2>
            <p className="mt-4 max-w-[380px] font-sans leading-[1.8] text-body-on-navy">{intro}</p>

            {/* Mobile: horizontal scroll chain, no connecting line */}
            <div className="mt-10 flex gap-6 overflow-x-auto pb-1 lg:hidden">
              {steps.map((step, i) => (
                <div key={step.label} className="flex flex-none flex-col items-start gap-[0.6rem]">
                  <span className={cn('h-[21px] w-[21px] rounded-full border-[1.5px] border-line-navy-strong bg-navy transition-colors duration-500', i <= activeIndex && 'border-gold bg-gold')} />
                  <span className={cn('whitespace-nowrap font-serif text-[0.85rem] font-medium text-faint-on-navy transition-colors duration-500', i === activeIndex && 'text-gold-light', i < activeIndex && 'text-ivory')}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop: vertical chain with an animated progress line */}
            <div className="relative mt-10 hidden flex-col lg:flex">
              <span className="absolute left-[10px] top-[22px] bottom-[22px] w-px bg-line-navy" aria-hidden="true" />
              <span
                className="absolute left-[10px] top-[22px] w-px origin-top bg-gold transition-[height] duration-500 ease-[var(--ease-signature)]"
                style={{ height: `calc((100% - 44px) * ${steps.length > 1 ? activeIndex / (steps.length - 1) : 0})` }}
                aria-hidden="true"
              />
              {steps.map((step, i) => (
                <div key={step.label} className="relative z-[1] flex items-center gap-[1.1rem] pb-10 last:pb-0">
                  <span className={cn('h-[21px] w-[21px] shrink-0 rounded-full border-[1.5px] border-line-navy-strong bg-navy transition-colors duration-500', i <= activeIndex && 'border-gold bg-gold')} />
                  <span className={cn('font-serif text-[1.15rem] font-medium text-faint-on-navy transition-colors duration-500', i === activeIndex && 'text-gold-light', i < activeIndex && 'text-ivory')}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div
                key={step.label}
                ref={(el) => { stepRefs.current[i] = el }}
                className="flex min-h-[62vh] flex-col justify-center border-t border-line-navy py-12 first:border-t-0"
              >
                <span className="font-serif text-[0.85rem] text-gold-light">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-[0.9rem] font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-semibold text-ivory">{step.label}</h3>
                <p className="mt-[1.1rem] max-w-[520px] font-sans text-[1.02rem] leading-[1.85] text-body-on-navy">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
