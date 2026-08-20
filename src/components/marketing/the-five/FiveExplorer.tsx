'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
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

export function FiveExplorer({
  pillars,
  related,
}: {
  pillars: PillarContent[]
  related: Record<string, PillarRelated>
}) {
  const [active, setActive] = useState(0)
  const current = pillars[active]
  const currentRelated = related[current.key] ?? { programs: [], articles: [], stories: [] }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-border-subtle">
        {pillars.map((pillar, i) => (
          <button
            key={pillar.key}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'relative px-5 py-4 font-sans text-sm font-medium uppercase transition-colors',
              active === i ? 'text-brand-primary' : 'text-ink-muted hover:text-brand-primary',
            )}
            style={{ letterSpacing: '0.06em' }}
          >
            {pillar.name}
            {active === i && (
              <motion.span
                layoutId="five-underline"
                className="absolute inset-x-0 -bottom-px h-[2px] bg-brand-accent"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-12 py-14 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <p className="font-serif text-2xl font-medium italic leading-snug text-brand-primary">{current.tagline}</p>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink-muted">{current.body}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {current.sphereOfInfluence.map((sphere) => (
                <span
                  key={sphere}
                  className="border border-border-strong px-3 py-1.5 font-sans text-xs uppercase text-brand-primary"
                  style={{ letterSpacing: '0.04em' }}
                >
                  {sphere}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:col-span-5 lg:grid-cols-1">
            <RelatedList title="Related Programs" items={currentRelated.programs} basePath="/programs" empty="Programs for this pillar are in development." />
            <RelatedList title="Kingdom Intelligence" items={currentRelated.articles} basePath="/insights" empty="No intelligence published for this pillar yet." />
            <RelatedList title="Stories" items={currentRelated.stories} basePath="/stories" empty="No stories published for this pillar yet." />
          </div>
        </motion.div>
      </AnimatePresence>
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
    <div>
      <p className="font-sans text-xs font-semibold uppercase text-brand-secondary" style={{ letterSpacing: 'var(--tracking-label)' }}>
        {title}
      </p>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={`${basePath}/${item.slug}`} className="font-sans text-sm text-brand-primary underline-offset-4 hover:underline">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 font-sans text-sm text-ink-muted">{empty}</p>
      )}
    </div>
  )
}
