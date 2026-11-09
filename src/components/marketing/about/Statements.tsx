'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { EASE_OUT } from '@/components/motion/primitives'

export function Statements({
  vision,
  mission,
  purpose,
  essence,
}: {
  vision: string
  mission: string
  purpose: string
  essence: string
}) {
  const rows = [
    { label: 'Vision', text: vision },
    { label: 'Mission', text: mission },
    { label: 'Purpose', text: purpose },
    { label: 'Essence', text: essence },
  ]

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div
        className="absolute inset-0 -z-10 text-ivory opacity-[0.05] [mask-image:linear-gradient(270deg,black,transparent_60%)]"
        aria-hidden="true"
      >
        <KingdomGrid id="about-statements-grid" className="h-full w-full" />
      </div>
      <Container className="py-[clamp(3rem,6vw,4.5rem)]">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className="relative grid grid-cols-1 items-baseline gap-[0.6rem] py-[2.3rem] lg:grid-cols-[0.28fr_0.72fr] lg:gap-8"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.5 }}
          >
            {/* Each statement is ruled off by a line that draws across before the words arrive. */}
            <motion.span
              className="absolute inset-x-0 top-0 h-px origin-left bg-line-navy"
              variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
              transition={{ duration: 1.1, ease: EASE_OUT }}
              aria-hidden="true"
            />
            <motion.span
              className="absolute left-0 top-0 h-px w-16 origin-left bg-gold"
              variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
              transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT }}
              aria-hidden="true"
            />
            <motion.span
              className="font-sans text-[0.72rem] font-bold uppercase text-gold-light"
              style={{ letterSpacing: '0.14em' }}
              variants={{ hidden: { opacity: 0, x: -10 }, shown: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
            >
              {row.label}
            </motion.span>
            <motion.p
              className="font-serif text-[clamp(1.1rem,2vw,1.5rem)] font-medium leading-[1.5] text-ivory"
              variants={{ hidden: { opacity: 0, y: 18 }, shown: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT }}
            >
              {row.text}
            </motion.p>
            {i === rows.length - 1 && <span className="absolute inset-x-0 bottom-0 h-px bg-line-navy" aria-hidden="true" />}
          </motion.div>
        ))}
      </Container>
    </section>
  )
}
