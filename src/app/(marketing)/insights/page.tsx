import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { ArticleCard } from '@/components/marketing/ArticleCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Kingdom Intelligence',
  description: 'Research, briefings, and strategic perspective from Kingdom E.L.E.C.T. for Africa.',
}

export default async function InsightsPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedDate: 'desc' },
    select: { title: true, slug: true, subtitle: true, excerpt: true, category: true, publishedDate: true },
  })

  return (
    <>
      <section className="bg-surface pb-16 pt-40 md:pt-48">
        <Container>
          <Eyebrow>Kingdom Intelligence</Eyebrow>
          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
            Research, briefings, and strategic perspective.
          </h1>
        </Container>
      </section>

      <section className="bg-surface pb-24 md:pb-32">
        <Container wide={false}>
          {articles.length > 0 ? (
            <div className="mx-auto max-w-3xl">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <p className="border border-border-subtle p-10 text-center font-sans text-ink-muted">
              The intelligence desk is quiet for now — new research and briefings will appear here.
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
