'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Kicker } from '@/components/ui/Section'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { EASE_OUT, SplitWords } from '@/components/motion/primitives'

const PILLARS = [22, 38, 54, 72, 94]

// Drifting gold motes, placed by a fixed-seed generator so the server and
// the browser render the same positions.
const MOTES = (() => {
  let seed = 7
  const next = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  return Array.from({ length: 16 }, () => ({
    left: +(48 + next() * 48).toFixed(2),
    top: +(30 + next() * 66).toFixed(2),
    size: +(1.5 + next() * 2.5).toFixed(2),
    duration: +(10 + next() * 9).toFixed(2),
    delay: -+(next() * 14).toFixed(2),
    drift: Math.round(-14 + next() * 28),
    opacity: +(0.35 + next() * 0.45).toFixed(2),
  }))
})()

/** "A. B. C." → ["A. B.", "C."]: the closing sentence gets the gold accent. */
function splitClosingSentence(text: string): [string, string] {
  const sentences = text.trim().match(/[^.!?]+[.!?]+(\s+|$)/g)
  if (!sentences || sentences.length < 2 || sentences.join('').trim() !== text.trim()) return [text, '']
  const last = sentences.pop()!.trim()
  const lead = sentences.join('').trim()
  // Abbreviations such as "E.L.E.C.T." read as one-letter "sentences"; leave those alone.
  const words = (s: string) => s.split(/\s+/).length
  if (words(last) < 2 || words(lead) < 2) return [text, '']
  return [lead, last]
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
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // Scrolling away: the copy lifts and fades faster than the planet, which
  // drifts and swells slightly, giving the hero depth as it leaves.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const still = (to: number[]) => (reduce ? to.map(() => to[0]) : to)
  const copyY = useTransform(scrollYProgress, [0, 1], still([0, 140]))
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0])
  const earthY = useTransform(scrollYProgress, [0, 1], still([0, 90]))
  const earthScale = useTransform(scrollYProgress, [0, 1], still([1, 1.1]))
  const pillarsY = useTransform(scrollYProgress, [0, 1], still([0, 170]))

  // Mouse parallax: layers shift a few pixels against the pointer.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 50, damping: 20, mass: 0.8 })
  const springY = useSpring(pointerY, { stiffness: 50, damping: 20, mass: 0.8 })
  const earthX = useTransform(springX, (v) => v * -28)
  const earthTilt = useTransform(springY, (v) => v * -18)
  const gridX = useTransform(springX, (v) => v * 12)
  const gridY = useTransform(springY, (v) => v * 12)
  const pillarsX = useTransform(springX, (v) => v * 16)

  function trackPointer(event: React.PointerEvent<HTMLElement>) {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - box.left) / box.width - 0.5)
    pointerY.set((event.clientY - box.top) / box.height - 0.5)
  }

  const [lead, closing] = splitClosingSentence(heading)
  const leadWords = lead.split(/\s+/).length
  const copyDelay = 0.4 + (leadWords + closing.split(/\s+/).length) * 0.055

  return (
    <header
      ref={ref}
      onPointerMove={trackPointer}
      onPointerLeave={() => {
        pointerX.set(0)
        pointerY.set(0)
      }}
      className="relative isolate flex min-h-[calc(100dvh-4.25rem)] flex-col justify-center overflow-hidden bg-navy"
    >
      {/* Atmosphere: deep navy warming to gold at the horizon (Navy to Gold gradient). */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(120% 70% at 90% 115%, rgba(201,146,24,0.24), transparent 58%), radial-gradient(80% 70% at 0% 0%, rgba(28,59,102,0.6), transparent 62%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute -inset-10 -z-20 text-ivory [mask-image:radial-gradient(ellipse_60%_55%_at_22%_38%,black,transparent_78%)]"
        style={{ x: gridX, y: gridY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.075 }}
        transition={{ duration: 2.4, ease: EASE_OUT }}
        aria-hidden="true"
      >
        <KingdomGrid id="hero-kingdom-grid" className="h-full w-full" />
      </motion.div>

      {/* The planet: comes into focus from a soft blur, then a gold rim of light circles it. */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 -right-[62%] -z-10 flex w-[130%] items-start pt-[8vh] sm:-right-[22%] sm:w-[72%] sm:items-center sm:pt-0 lg:-right-[9%] lg:w-[58%]"
        style={{ y: earthY, scale: earthScale }}
        aria-hidden="true"
      >
        <motion.div className="relative aspect-square w-full" style={{ x: earthX, y: earthTilt }}>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.16, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2.2, ease: EASE_OUT }}
          >
            <Image
              src="/brand/earth-africa.jpg"
              alt=""
              fill
              preload
              sizes="(min-width: 1024px) 58vw, (min-width: 640px) 72vw, 130vw"
              className="object-cover opacity-30 sm:opacity-45 [mask-image:radial-gradient(circle_closest-side,black_80%,transparent_94%)]"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 1.1, ease: EASE_OUT }}
          >
            <div
              className="absolute inset-0 rounded-full motion-safe:animate-[spin-slow_48s_linear_infinite]"
              style={{
                background:
                  'radial-gradient(circle closest-side, transparent 86%, rgba(227,185,78,0.5) 92.5%, rgba(227,185,78,0.12) 95%, transparent 100%)',
                maskImage: 'conic-gradient(from 210deg, transparent, black 70deg, black 110deg, transparent 180deg)',
                WebkitMaskImage: 'conic-gradient(from 210deg, transparent, black 70deg, black 110deg, transparent 180deg)',
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Keeps the headline legible where it crosses the planet. */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-navy)_0%,rgba(11,31,58,0.82)_38%,rgba(11,31,58,0)_72%)]"
        aria-hidden="true"
      />

      {MOTES.map((mote, i) => (
        <span
          key={i}
          className="pointer-events-none absolute -z-10 rounded-full bg-gold-light motion-reduce:hidden"
          style={
            {
              left: `${mote.left}%`,
              top: `${mote.top}%`,
              width: mote.size,
              height: mote.size,
              boxShadow: '0 0 6px rgba(227,185,78,0.7)',
              animation: `mote ${mote.duration}s ease-in-out ${mote.delay}s infinite`,
              '--mote-drift': `${mote.drift}px`,
              '--mote-opacity': mote.opacity,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      ))}

      {/* The five pillars rise from their foundation (logo animation: "Build"), then breathe. */}
      <motion.div
        className="pointer-events-none absolute bottom-0 right-[5%] -z-10 h-[46%] sm:h-[60%]"
        style={{ y: pillarsY }}
        aria-hidden="true"
      >
        <motion.div className="flex h-full items-end gap-[clamp(6px,1vw,14px)]" style={{ x: pillarsX }}>
          {PILLARS.map((height, i) => (
            <motion.span
              key={height}
              className="block w-[clamp(6px,1.1vw,16px)] origin-bottom"
              style={{ height: `${height}%` }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.9 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.13, ease: EASE_OUT }}
            >
              <span
                className="block h-full w-full origin-bottom rounded-t-[2px]"
                style={{
                  background: 'linear-gradient(180deg, var(--color-gold-light), var(--color-gold) 70%, transparent)',
                  animation: `pillar-breathe 4.6s ease-in-out ${2.4 + i * 0.25}s infinite`,
                }}
              />
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="relative" style={{ y: copyY, opacity: copyOpacity }}>
        <Container className="py-[clamp(4rem,11vh,7rem)]">
          <div className="max-w-[940px]">
            {eyebrow && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
              >
                <Kicker onDark>{eyebrow}</Kicker>
              </motion.div>
            )}
            <h1 className="mt-6 font-serif text-[clamp(2.5rem,5.4vw,4.6rem)] font-semibold leading-[1.1] tracking-[-0.015em] text-ivory">
              <SplitWords text={lead} delay={0.4} />
              {closing && (
                <>
                  {' '}
                  <span className="font-medium italic text-gold-light">
                    <SplitWords text={closing} delay={0.4 + leadWords * 0.055} />
                  </span>
                </>
              )}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: copyDelay, ease: EASE_OUT }}
              className="mt-7 max-w-[600px] font-sans text-[1.08rem] leading-[1.8] text-body-on-navy"
            >
              {subheading}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: copyDelay + 0.12, ease: EASE_OUT }}
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
      </motion.div>

      {/* A thin gold line draws across the foot of the hero. */}
      <motion.span
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,transparent,rgba(227,185,78,0.55)_30%,rgba(227,185,78,0.55)_70%,transparent)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.9, ease: EASE_OUT }}
        aria-hidden="true"
      />
    </header>
  )
}
