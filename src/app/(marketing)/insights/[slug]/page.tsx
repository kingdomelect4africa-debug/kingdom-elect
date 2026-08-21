import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'
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
    <article className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(4.5rem,9vw,8.5rem)]">
      <SetNavTone tone="light" />
      <Container>
        <div className="mx-auto max-w-[680px]">
          <Kicker>{CATEGORY_LABELS[article.category] ?? article.category}</Kicker>
          <h1 className="mt-4 font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            {article.title}
          </h1>
          {article.subtitle && <p className="mt-5 font-sans text-[1.1rem] text-body">{article.subtitle}</p>}

          <div
            className="mt-6 flex flex-wrap items-center gap-3 border-b border-line pb-6 font-sans text-[0.76rem] font-semibold uppercase text-body"
            style={{ letterSpacing: '0.06em' }}
          >
            {article.authors.length > 0 && (
              <span>{article.authors.map((a) => `${a.person.firstName} ${a.person.lastName}`).join(', ')}</span>
            )}
            {article.publishedDate && (
              <>
                <span aria-hidden="true">·</span>
                <span>{formatDate(article.publishedDate)}</span>
              </>
            )}
          </div>

          <div className="mt-10 whitespace-pre-line font-sans text-[1.05rem] leading-[1.85] text-body">{article.body}</div>
        </div>
      </Container>
    </article>
  )
}
