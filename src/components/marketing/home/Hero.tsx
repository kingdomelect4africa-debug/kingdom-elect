'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Kicker } from '@/components/ui/Section'
import { HeroGridLines } from '@/components/devices/HeroGridLines'
import { HeroBars } from '@/components/devices/HeroBars'
import { KingdomAura } from '@/components/devices/KingdomAura'

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(0)
  const isDecimal = to % 1 !== 0

  useEffect(() => {
    if (!inView) return
    const duration = 1500
    const start = performance.now()
    let frame: number
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(to * eased)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to])

  return (
    <span ref={ref}>
      {isDecimal ? value.toFixed(1) : Math.round(value)}
      {suffix}
    </span>
  )
}

export function Hero({
  eyebrow,
  heading,
  subheading,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: {
  eyebrow: string | null
  heading: string
  subheading: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}) {
  return (
    <header className="relative z-0 flex min-h-[92vh] flex-col justify-center overflow-hidden bg-navy">
      <KingdomAura className="-right-[35%] top-0 z-[1] h-[85%] w-[100%] sm:-right-[8%] sm:h-full sm:w-[58%]" tone="navy" />
      <HeroGridLines className="z-[1]" />
      <HeroBars className="absolute right-[4%] bottom-0 z-[1] h-[62%] opacity-85" />

      <Container className="relative z-[2] py-[clamp(6rem,12vw,8rem)]">
        <div className="max-w-[900px]">
          {eyebrow && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <Kicker onDark>{eyebrow}</Kicker>
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-[1.4rem] font-serif text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.12] tracking-[-0.01em] text-ivory"
          >
            {heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[620px] font-sans text-[1.1rem] leading-[1.8] text-body-on-navy"
          >
            {subheading}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap gap-[1.1rem]"
          >
            <Button href={secondaryCtaHref} variant="gold">
              {secondaryCtaLabel}
            </Button>
            <Button href={primaryCtaHref} variant="line-navy">
              {primaryCtaLabel}
            </Button>
          </motion.div>
        </div>
      </Container>

      <div className="relative z-[2] border-t border-line-navy">
        <Container className="grid grid-cols-1 sm:grid-cols-3">
          {[
            { to: 1.5, suffix: 'B+', label: 'Billion+ people affected by ungoverned wealth systems' },
            { to: 5, suffix: '', label: 'Strategic spheres converging under one mandate' },
            { to: 54, suffix: '', label: 'Nations in view of collective transformation' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-t border-line-navy px-[clamp(1.5rem,5vw,4rem)] py-[1.6rem] first:border-t-0 sm:border-t-0 sm:border-l sm:first:border-l-0 sm:first:pl-0"
            >
              <div className="font-serif text-[clamp(1.8rem,3vw,2.4rem)] font-semibold text-gold-light">
                <CountUp to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="mt-1 font-sans text-[0.78rem] text-faint-on-navy">{stat.label}</div>
            </div>
          ))}
        </Container>
      </div>
    </header>
  )
}
