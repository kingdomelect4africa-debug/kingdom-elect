'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { RisingForms } from '@/components/devices/RisingForms'
import { RadiatingLines } from '@/components/devices/RadiatingLines'

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
    <section className="relative flex min-h-[100vh] items-center overflow-hidden bg-brand-primary text-ink-inverse">
      <RadiatingLines className="absolute -right-32 -top-32 h-[560px] w-[560px] text-white" lines={26} origin="top-right" />
      <div className="absolute inset-x-0 bottom-0">
        <RisingForms className="h-40 w-full text-brand-accent opacity-70" count={5} />
      </div>

      <Container className="relative z-10 pt-32">
        <div className="max-w-4xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-xs font-semibold uppercase text-brand-accent"
              style={{ letterSpacing: 'var(--tracking-label)' }}
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ivory-500/90 md:text-xl"
          >
            {subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <Button href={secondaryCtaHref} variant="gold" size="lg">
              {secondaryCtaLabel}
            </Button>
            <Button href={primaryCtaHref} variant="ghost" size="lg">
              {primaryCtaLabel}
            </Button>
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-sans text-[10px] uppercase text-ivory-700" style={{ letterSpacing: 'var(--tracking-label)' }}>
          Scroll
        </span>
        <span className="h-10 w-px bg-white/30" />
      </motion.div>
    </section>
  )
}
