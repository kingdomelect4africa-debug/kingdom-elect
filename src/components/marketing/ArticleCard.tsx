import Link from 'next/link'
import { formatDate } from '@/lib/format'

const CATEGORY_LABELS: Record<string, string> = {
  RESEARCH: 'Research', POLICY: 'Policy', GOVERNANCE: 'Governance', LEADERSHIP: 'Leadership',
  ECONOMY: 'Economy', TECHNOLOGY: 'Technology', EDUCATION: 'Education', CULTURE: 'Culture',
  INNOVATION: 'Innovation', TERRITORIES: 'Territories',
}

export function ArticleCard({
  article,
  showCategory = false,
}: {
  article: { title: string; slug: string; subtitle: string | null; excerpt: string; category: string; publishedDate: Date | null }
  showCategory?: boolean
}) {
  const words = article.excerpt.split(/\s+/).length + 400
  const readingMinutes = Math.max(3, Math.round(words / 200))

  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group grid grid-cols-1 items-baseline gap-2 border-t border-line py-[1.9rem] transition-[padding-left] duration-400 ease-[var(--ease-signature)] last:border-b hover:pl-[0.6rem] sm:grid-cols-[140px_1fr_auto] sm:gap-8"
    >
      <span className="font-sans text-[0.8rem] text-body">{article.publishedDate ? formatDate(article.publishedDate) : ''}</span>
      <div>
        {showCategory && (
          <span className="font-sans text-[0.68rem] font-bold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
        )}
        <h3 className="font-serif text-[clamp(1.05rem,2vw,1.35rem)] font-semibold text-ink">{article.title}</h3>
        {article.subtitle && <div className="mt-[0.4rem] font-sans text-[0.92rem] text-body">{article.subtitle}</div>}
      </div>
      <span className="flex items-center justify-start gap-2 whitespace-nowrap font-sans text-[0.76rem] text-body sm:justify-end">
        {CATEGORY_LABELS[article.category] ?? article.category} · {readingMinutes} min read
        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 -translate-x-1.5 opacity-0 transition-all duration-400 ease-[var(--ease-signature)] group-hover:translate-x-0 group-hover:opacity-100">
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  )
}
