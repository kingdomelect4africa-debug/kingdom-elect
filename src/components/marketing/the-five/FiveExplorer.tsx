'use client'

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_OUT } from '@/components/motion/primitives'
import { cn } from '@/lib/cn'

export type PillarContent = {
  key: string
  name: string
  tagline: string
  body: string
  sphereOfInfluence: string[]
}

export type PillarRelated = {
  programs: { title: string; slug: string }[]
  articles: { title: string; slug: string }[]
  stories: { title: string; slug: string }[]
}

const LETTERS: Record<string, string> = {
  EDUCATOR: 'E',
  LEADER: 'L',
  ENTREPRENEUR: 'E',
  CREATIVE: 'C',
  TECHNOCRAT: 'T',
}

const SLIDE = { type: 'spring', stiffness: 380, damping: 36 } as const

export function FiveExplorer({
  pillars,
  related,
}: {
  pillars: PillarContent[]
  related: Record<string, PillarRelated>
}) {
  const [active, setActive] = useState(0)
  const id = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const current = pillars[active]
  if (!current) return null
  const currentRelated = related[current.key] ?? { programs: [], articles: [], stories: [] }

  function onKeyDown(event: React.KeyboardEvent, i: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (i + step + pillars.length) % pillars.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-ivory">
      <div role="tablist" aria-label="The Five" className="grid grid-cols-5 border-b border-line">
        {pillars.map((pillar, i) => {
          const selected = active === i
          return (
            <button
              key={pillar.key}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => onKeyDown(event, i)}
              className="group relative isolate border-l border-line px-1 pb-4 pt-6 text-center first:border-l-0 sm:px-4 sm:pb-6 sm:pt-8"
            >
              {selected && <motion.span layoutId={`${id}-wash`} className="absolute inset-0 -z-10 bg-ivory-dim" transition={SLIDE} />}
              <motion.span
                className={cn(
                  'block font-serif text-[clamp(2.1rem,4.6vw,3.7rem)] font-semibold leading-none transition-[color,-webkit-text-stroke-color] duration-500 [-webkit-text-stroke-width:1.2px]',
                  selected
                    ? 'text-gold [-webkit-text-stroke-color:var(--color-gold)]'
                    : 'text-transparent [-webkit-text-stroke-color:var(--color-line-strong)] group-hover:[-webkit-text-stroke-color:var(--color-gold-dark)]',
                )}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: EASE_OUT }}
              >
                {LETTERS[pillar.key] ?? pillar.name[0]}
              </motion.span>
              {/* Too narrow for the names on phones: they stay for screen readers, and the panel names the pillar. */}
              <span
                className={cn(
                  'sr-only font-sans text-[0.66rem] font-semibold uppercase transition-colors duration-500 sm:not-sr-only sm:mt-[0.7rem] sm:block',
                  selected ? 'text-ink' : 'text-body',
                )}
                style={{ letterSpacing: '0.1em' }}
              >
                {pillar.name}
              </span>
              {selected && <motion.span layoutId={`${id}-rule`} className="absolute inset-x-0 -bottom-px h-[2px] bg-gold" transition={SLIDE} />}
            </button>
          )
        })}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="grid gap-[clamp(2rem,4vw,3rem)] p-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-[1.2fr_0.9fr]"
          >
            <div>
              <p className="mb-3 font-sans text-[0.68rem] font-bold uppercase text-emerald sm:hidden" style={{ letterSpacing: '0.1em' }}>
                {current.name}
              </p>
              <h3 className="pb-1 font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-semibold italic leading-[1.2] text-ink">{current.tagline}</h3>
              <p className="mt-[1.1rem] font-sans leading-[1.85] text-body">{current.body}</p>
              <div className="mt-[1.4rem] flex flex-wrap gap-[0.6rem]">
                {current.sphereOfInfluence.map((sphere, j) => (
                  <motion.span
                    key={sphere}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + j * 0.05, ease: EASE_OUT }}
                    className="rounded-[var(--radius-sm)] border border-line-strong px-[0.8rem] py-[0.4rem] font-sans text-[0.72rem] uppercase text-body"
                    style={{ letterSpacing: '0.04em' }}
                  >
                    {sphere}
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <RelatedList title="Related Programs" items={currentRelated.programs} basePath="/programs" empty="Programs for this pillar are in development." />
              <RelatedList title="Kingdom Intelligence" items={currentRelated.articles} basePath="/insights" empty="No intelligence published for this pillar yet." />
              <RelatedList title="Stories" items={currentRelated.stories} basePath="/stories" empty="No stories published for this pillar yet." />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function RelatedList({
  title,
  items,
  basePath,
  empty,
}: {
  title: string
  items: { title: string; slug: string }[]
  basePath: string
  empty: string
}) {
  return (
    <div className="[&+&]:mt-7">
      <h5 className="font-sans text-[0.68rem] font-bold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
        {title}
      </h5>
      {items.length > 0 ? (
        <div className="mt-[0.8rem]">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              className="group flex items-center justify-between gap-3 border-b border-dashed border-line py-2 font-sans text-[0.92rem] text-ink transition-colors hover:text-gold-dark"
            >
              {item.title}
              <span className="-translate-x-1 opacity-0 transition-[translate,opacity] duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-[0.8rem] font-sans text-[0.85rem] text-body">{empty}</p>
      )}
    </div>
  )
}
