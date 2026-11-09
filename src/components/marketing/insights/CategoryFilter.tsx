'use client'

import { createContext, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { ArticleCard } from '@/components/marketing/ArticleCard'
import { EASE_OUT } from '@/components/motion/primitives'

type ArticleListItem = {
  title: string
  slug: string
  subtitle: string | null
  excerpt: string
  category: string
  publishedDate: Date | null
}

const CATEGORY_LABELS: Record<string, string> = {
  RESEARCH: 'Research', POLICY: 'Policy', GOVERNANCE: 'Governance', LEADERSHIP: 'Leadership',
  ECONOMY: 'Economy', TECHNOLOGY: 'Technology', EDUCATION: 'Education', CULTURE: 'Culture',
  INNOVATION: 'Innovation', TERRITORIES: 'Territories',
}

const FilterContext = createContext<{ active: string; setActive: (category: string) => void } | null>(null)

/**
 * Reimplements the mockup's vanilla-JS pill toggling (kingdom-intelligence.html's
 * inline <script>, which flips `display:none` on `.intel-row`s by `data-category`)
 * as React state shared between the pills (rendered in the page-header) and the
 * list below it — filtering the article list that the page already fetched from
 * Prisma, with no extra server round-trip.
 */
export function CategoryFilterProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState('all')
  return <FilterContext.Provider value={{ active, setActive }}>{children}</FilterContext.Provider>
}

function useCategoryFilter() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useCategoryFilter must be used within a CategoryFilterProvider')
  return ctx
}

/** For the navy page hero: the active pill's gold wash slides between choices. */
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'relative isolate rounded-full border px-[1.15rem] py-2 font-sans text-[0.78rem] font-semibold transition-colors duration-300',
        active ? 'border-gold text-navy-deep' : 'border-line-navy-strong text-body-on-navy hover:border-ivory hover:text-ivory',
      )}
    >
      {active && (
        <motion.span
          layoutId="insights-active-pill"
          className="absolute inset-0 -z-10 rounded-full bg-gold"
          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
        />
      )}
      {children}
    </button>
  )
}

export function CategoryPills({ categories }: { categories: string[] }) {
  const { active, setActive } = useCategoryFilter()

  return (
    <div className="mt-8 flex flex-wrap gap-[0.6rem]">
      <Pill active={active === 'all'} onClick={() => setActive('all')}>
        All
      </Pill>
      {categories.map((category) => (
        <Pill key={category} active={active === category} onClick={() => setActive(category)}>
          {CATEGORY_LABELS[category] ?? category}
        </Pill>
      ))}
    </div>
  )
}

export function FilteredArticleList({ articles }: { articles: ArticleListItem[] }) {
  const { active } = useCategoryFilter()
  const filtered = active === 'all' ? articles : articles.filter((article) => article.category === active)

  if (filtered.length === 0) {
    return (
      <p className="rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-body">
        No briefings in this category yet.
      </p>
    )
  }

  // Briefings leaving the filter fade out, the rest close ranks, newcomers rise in.
  return (
    <div className="flex flex-col">
      <AnimatePresence initial={false} mode="popLayout">
        {filtered.map((article, i) => (
          <motion.div
            key={article.slug}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: EASE_OUT }}
            // Each card draws its own top rule; only the last keeps its bottom one.
            className="[&:not(:last-child)>a]:border-b-0"
          >
            <ArticleCard article={article} showCategory />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
