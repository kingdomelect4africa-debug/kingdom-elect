'use client'

import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/cn'
import { ArticleCard } from '@/components/marketing/ArticleCard'

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

function pillClasses(isActive: boolean) {
  return cn(
    'rounded-full border px-[1.15rem] py-2 font-sans text-[0.78rem] font-semibold transition-all duration-300 ease-[var(--ease-signature)]',
    isActive ? 'border-navy bg-navy text-ivory' : 'border-line-strong text-body hover:border-ink hover:text-ink',
  )
}

export function CategoryPills({ categories }: { categories: string[] }) {
  const { active, setActive } = useCategoryFilter()

  return (
    <div className="mt-7 flex flex-wrap gap-[0.6rem]">
      <button type="button" onClick={() => setActive('all')} className={pillClasses(active === 'all')}>
        All
      </button>
      {categories.map((category) => (
        <button key={category} type="button" onClick={() => setActive(category)} className={pillClasses(active === category)}>
          {CATEGORY_LABELS[category] ?? category}
        </button>
      ))}
    </div>
  )
}

export function FilteredArticleList({ articles }: { articles: ArticleListItem[] }) {
  const { active } = useCategoryFilter()
  const filtered = active === 'all' ? articles : articles.filter((article) => article.category === active)

  if (filtered.length === 0) {
    return (
      <p className="border border-dashed border-line-strong p-10 text-center font-sans text-body">
        No briefings in this category yet.
      </p>
    )
  }

  return (
    <div className="flex flex-col">
      {filtered.map((article) => (
        <ArticleCard key={article.slug} article={article} showCategory />
      ))}
    </div>
  )
}
