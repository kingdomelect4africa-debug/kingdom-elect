'use client'

import { useState } from 'react'
import Link from 'next/link'
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
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-line">
      <div className="grid grid-cols-5 border-b border-line">
        {pillars.map((pillar, i) => (
          <button
            key={pillar.key}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'relative border-l border-line px-4 pb-6 pt-8 text-center transition-colors duration-400 first:border-l-0',
              active === i && 'bg-ivory-dim',
            )}
          >
            <span className={cn('font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold text-line-strong transition-colors duration-400', active === i && 'text-gold')}>
              {LETTERS[pillar.key] ?? pillar.name[0]}
            </span>
            <span className="mt-[0.6rem] block font-sans text-[0.66rem] font-semibold uppercase text-body" style={{ letterSpacing: '0.1em' }}>
              {pillar.name}
            </span>
            {active === i && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-gold" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div className="grid gap-[clamp(2rem,4vw,3rem)] p-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-[1.2fr_0.9fr]">
        <div>
          <h3 className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-semibold italic text-ink">{current.tagline}</h3>
          <p className="mt-[1.1rem] font-sans leading-[1.85] text-body">{current.body}</p>
          <div className="mt-[1.4rem] flex flex-wrap gap-[0.6rem]">
            {current.sphereOfInfluence.map((sphere) => (
              <span key={sphere} className="rounded-[var(--radius-sm)] border border-line-strong px-[0.8rem] py-[0.4rem] font-sans text-[0.72rem] uppercase text-body" style={{ letterSpacing: '0.04em' }}>
                {sphere}
              </span>
            ))}
          </div>
        </div>

        <div>
          <RelatedList title="Related Programs" items={currentRelated.programs} basePath="/programs" empty="Programs for this pillar are in development." />
          <RelatedList title="Kingdom Intelligence" items={currentRelated.articles} basePath="/insights" empty="No intelligence published for this pillar yet." />
          <RelatedList title="Stories" items={currentRelated.stories} basePath="/stories" empty="No stories published for this pillar yet." />
        </div>
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
            <Link key={item.slug} href={`${basePath}/${item.slug}`} className="block border-b border-dashed border-line py-2 font-sans text-[0.92rem] text-ink hover:text-gold-dark">
              {item.title}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-[0.8rem] font-sans text-[0.85rem] text-body">{empty}</p>
      )}
    </div>
  )
}
