import Link from 'next/link'
import { formatDate } from '@/lib/format'

const CATEGORY_LABELS: Record<string, string> = {
  RESEARCH: 'Research', POLICY: 'Policy', GOVERNANCE: 'Governance', LEADERSHIP: 'Leadership',
  ECONOMY: 'Economy', TECHNOLOGY: 'Technology', EDUCATION: 'Education', CULTURE: 'Culture',
  INNOVATION: 'Innovation', TERRITORIES: 'Territories',
}

export function ArticleCard({
  article,
}: {
  article: { title: string; slug: string; subtitle: string | null; excerpt: string; category: string; publishedDate: Date | null }
}) {
  const words = article.excerpt.split(/\s+/).length + 400
  const readingMinutes = Math.max(3, Math.round(words / 200))

  return (
    <Link href={`/insights/${article.slug}`} className="group block border-t border-border-subtle py-8 first:border-t-0">
      <p className="font-sans text-xs font-semibold uppercase text-brand-secondary" style={{ letterSpacing: 'var(--tracking-label)' }}>
        {CATEGORY_LABELS[article.category] ?? article.category}
      </p>
      <h3 className="mt-3 font-serif text-2xl font-medium leading-snug text-brand-primary transition-colors group-hover:text-brand-accent md:text-3xl">
        {article.title}
      </h3>
      {article.subtitle && <p className="mt-2 font-sans text-base text-ink-muted">{article.subtitle}</p>}
      <p className="mt-4 flex items-center gap-3 font-sans text-xs uppercase text-ink-muted" style={{ letterSpacing: '0.08em' }}>
        {article.publishedDate && <span>{formatDate(article.publishedDate)}</span>}
        <span aria-hidden="true">·</span>
        <span>{readingMinutes} min read</span>
      </p>
    </Link>
  )
}
