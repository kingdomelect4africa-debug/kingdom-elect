import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { formatDate } from '@/lib/format'

export const revalidate = 60

const CATEGORY_LABELS: Record<string, string> = {
  RESEARCH: 'Research', POLICY: 'Policy', GOVERNANCE: 'Governance', LEADERSHIP: 'Leadership',
  ECONOMY: 'Economy', TECHNOLOGY: 'Technology', EDUCATION: 'Education', CULTURE: 'Culture',
  INNOVATION: 'Innovation', TERRITORIES: 'Territories',
}

async function getArticle(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { authors: { include: { person: true } } },
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}
  return { title: article.seoTitle ?? article.title, description: article.seoDescription ?? article.excerpt }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article || article.status !== 'PUBLISHED') notFound()

  return (
    <article className="bg-surface pb-24 pt-40 md:pb-32 md:pt-48">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-xs font-semibold uppercase text-brand-secondary" style={{ letterSpacing: 'var(--tracking-label)' }}>
            {CATEGORY_LABELS[article.category] ?? article.category}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-brand-primary md:text-5xl">
            {article.title}
          </h1>
          {article.subtitle && <p className="mt-4 font-sans text-xl text-ink-muted">{article.subtitle}</p>}

          <div className="mt-6 flex items-center gap-3 border-b border-border-subtle pb-6 font-sans text-xs uppercase text-ink-muted" style={{ letterSpacing: '0.06em' }}>
            {article.authors.length > 0 && (
              <span>
                {article.authors.map((a) => `${a.person.firstName} ${a.person.lastName}`).join(', ')}
              </span>
            )}
            {article.publishedDate && (
              <>
                <span aria-hidden="true">·</span>
                <span>{formatDate(article.publishedDate)}</span>
              </>
            )}
          </div>

          <div className="mt-10 whitespace-pre-line font-sans text-lg leading-relaxed text-ink">{article.body}</div>
        </div>
      </Container>
    </article>
  )
}
