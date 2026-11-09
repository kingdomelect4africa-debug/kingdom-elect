'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { EASE_OUT, Reveal } from '@/components/motion/primitives'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { cn } from '@/lib/cn'

type Step = { label: string; description: string }

/**
 * The framework is a sequence where each stage contains the one before it,
 * so it is drawn as concentric rings: People at the centre, radiating out to
 * Generations. On large screens the section pins while the visitor scrolls
 * through it and each ring draws in turn; on phones, and for anyone who
 * prefers reduced motion, it is a plain list.
 */
export function KingdomFramework({ heading, intro, steps }: { heading: string; intro: string; steps: Step[] }) {
  return (
    <section className="relative bg-navy text-ivory">
      <div className="hidden lg:motion-safe:block">
        <PinnedFramework heading={heading} intro={intro} steps={steps} />
      </div>
      <div className="lg:motion-safe:hidden">
        <ListFramework heading={heading} intro={intro} steps={steps} />
      </div>
    </section>
  )
}

function PinnedFramework({ heading, intro, steps }: { heading: string; intro: string; steps: Step[] }) {
  const track = useRef<HTMLDivElement>(null)
  const n = Math.max(steps.length, 1)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(n - 1, Math.max(0, Math.floor(p * n)))
    setActive((current) => (current === next ? current : next))
  })

  // The gold line reaches each dot halfway through that step's stretch of scroll.
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const line = useTransform(smooth, (p) => (n > 1 ? Math.min(1, Math.max(0, (p * n - 0.5) / (n - 1))) : 1))

  function jumpTo(i: number) {
    const el = track.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + travel * ((i + 0.55) / n), behavior: 'smooth' })
  }

  return (
    <div ref={track} className="relative" style={{ height: `${n * 62 + 38}vh` }}>
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        <div
          className="absolute inset-0 text-ivory opacity-[0.05] [mask-image:radial-gradient(ellipse_55%_60%_at_75%_55%,black,transparent_75%)]"
          aria-hidden="true"
        >
          <KingdomGrid id="framework-kingdom-grid" className="h-full w-full" />
        </div>

        <Container className="relative grid grid-cols-[0.9fr_1.1fr] items-center gap-[clamp(3rem,6vw,6rem)] pt-16">
          <div>
            <h2 className="font-serif text-[clamp(2rem,3.4vw,2.8rem)] font-semibold leading-[1.1] text-ivory">{heading}</h2>
            <p className="mt-5 max-w-[400px] font-sans leading-[1.8] text-body-on-navy">{intro}</p>

            <ol className="relative mt-[clamp(1.75rem,5vh,3rem)]">
              <span className="absolute bottom-[22px] left-[10px] top-[22px] w-px bg-line-navy" aria-hidden="true" />
              <motion.span
                className="absolute bottom-[22px] left-[10px] top-[22px] w-px origin-top bg-gold"
                style={{ scaleY: line }}
                aria-hidden="true"
              />
              {steps.map((step, i) => (
                <li key={step.label}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={i === active ? 'step' : undefined}
                    className="group relative z-[1] flex w-full items-center gap-[1.1rem] py-[clamp(0.45rem,1.4vh,0.8rem)] text-left"
                  >
                    <span
                      className={cn(
                        'relative grid h-[21px] w-[21px] shrink-0 place-items-center rounded-full border-[1.5px] bg-navy transition-colors duration-500',
                        i <= active ? 'border-gold' : 'border-line-navy-strong group-hover:border-faint-on-navy',
                      )}
                    >
                      <span
                        className={cn(
                          'h-[9px] w-[9px] rounded-full bg-gold transition-transform duration-500 ease-[var(--ease-signature)]',
                          i <= active ? 'scale-100' : 'scale-0',
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        'font-serif text-[clamp(1.05rem,1.5vw,1.25rem)] transition-colors duration-500',
                        i === active ? 'text-gold-light' : i < active ? 'text-ivory' : 'text-faint-on-navy group-hover:text-body-on-navy',
                      )}
                    >
                      {step.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col items-center">
            <Rings steps={steps} progress={scrollYProgress} active={active} />
            <div className="relative mt-[clamp(0.5rem,2vh,1.5rem)] min-h-[7.5rem] w-full max-w-[480px] text-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <h3 className="font-serif text-[clamp(1.4rem,2.2vw,1.8rem)] font-semibold text-ivory">{steps[active]?.label}</h3>
                  <p className="mx-auto mt-2 max-w-[440px] font-sans text-[0.98rem] leading-[1.75] text-body-on-navy">{steps[active]?.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

const SIZE = 600
const C = SIZE / 2

function Rings({ steps, progress, active }: { steps: Step[]; progress: MotionValue<number>; active: number }) {
  const n = Math.max(steps.length, 1)
  const inner = 62
  const gap = (C - 24 - inner) / Math.max(n - 1, 1)

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-[min(100%,56vh,540px)] overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="framework-core">
          <stop offset="0%" stopColor="rgba(227,185,78,0.32)" />
          <stop offset="100%" stopColor="rgba(227,185,78,0)" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={inner * 1.6} fill="url(#framework-core)" />
      {steps.map((step, i) => (
        <Ring key={step.label} index={i} n={n} radius={inner + gap * i} label={step.label} progress={progress} active={active} />
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.text
          key={active}
          x={C}
          y={C}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gold-light font-serif text-[52px] font-semibold"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {String(active + 1).padStart(2, '0')}
        </motion.text>
      </AnimatePresence>
    </svg>
  )
}

function Ring({
  index,
  n,
  radius,
  label,
  progress,
  active,
}: {
  index: number
  n: number
  radius: number
  label: string
  progress: MotionValue<number>
  active: number
}) {
  // Each ring draws during its own stretch of the scroll.
  const draw = useTransform(progress, (p) => Math.min(1, Math.max(0, (p * n - index) / 0.85)))
  const angle = useTransform(draw, (d) => -Math.PI / 2 + d * Math.PI * 2)
  const headX = useTransform(angle, (a) => C + radius * Math.cos(a))
  const headY = useTransform(angle, (a) => C + radius * Math.sin(a))
  const headOpacity = useTransform(draw, (d) => (d > 0.01 && d < 0.99 ? 1 : 0))
  const isActive = index === active
  const reached = index <= active

  return (
    <g>
      <circle cx={C} cy={C} r={radius} fill="none" stroke="var(--color-line-navy)" strokeWidth={1} />
      <motion.circle
        cx={C}
        cy={C}
        r={radius}
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth={isActive ? 2 : 1.25}
        strokeLinecap="round"
        transform={`rotate(-90 ${C} ${C})`}
        style={{ pathLength: draw, filter: isActive ? 'drop-shadow(0 0 6px rgba(227,185,78,0.55))' : 'none' }}
      />
      <motion.circle cx={headX} cy={headY} r={4} fill="var(--color-gold-light)" style={{ opacity: headOpacity }} />
      <text
        x={C}
        y={C - radius}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn(
          'font-sans text-[11px] font-semibold uppercase transition-[fill] duration-500',
          isActive ? 'fill-gold-light' : reached ? 'fill-ivory' : 'fill-faint-on-navy',
        )}
        style={{ letterSpacing: '0.14em', paintOrder: 'stroke' }}
        stroke="var(--color-navy)"
        strokeWidth={10}
        strokeLinejoin="round"
      >
        {label}
      </text>
    </g>
  )
}

function ListFramework({ heading, intro, steps }: { heading: string; intro: string; steps: Step[] }) {
  return (
    <Container className="py-[clamp(4.5rem,9vw,8.5rem)]">
      <Reveal>
        <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ivory">{heading}</h2>
        <p className="mt-4 max-w-[520px] font-sans leading-[1.8] text-body-on-navy">{intro}</p>
      </Reveal>
      <ol className="mt-10 flex flex-col gap-8">
        {steps.map((step, i) => (
          <li key={step.label}>
            <Reveal delay={i * 0.06} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold bg-navy font-serif text-[0.8rem] text-gold-light">
                  {i + 1}
                </span>
                {i < steps.length - 1 && <span className="mt-2 w-px flex-1 bg-line-navy" aria-hidden="true" />}
              </div>
              <div className="pb-1">
                <h3 className="font-serif text-[1.25rem] font-semibold text-ivory">{step.label}</h3>
                <p className="mt-2 font-sans text-[0.95rem] leading-[1.75] text-body-on-navy">{step.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Container>
  )
}
