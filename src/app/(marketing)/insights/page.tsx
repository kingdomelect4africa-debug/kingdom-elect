import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'
import { CategoryFilterProvider, CategoryPills, FilteredArticleList } from '@/components/marketing/insights/CategoryFilter'

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

  const categories = Array.from(new Set(articles.map((article) => article.category))).sort()

  return (
    <CategoryFilterProvider>
      <SetNavTone tone="light" />

      <header className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <Container>
          <Kicker>Kingdom Intelligence</Kicker>
          <h1 className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            Research, briefings, and strategic perspective.
          </h1>
          <p className="mt-5 max-w-[560px] font-sans text-[1.05rem] text-body">
            Perspective for those who govern spheres, not just administer functions.
          </p>
          {articles.length > 0 && <CategoryPills categories={categories} />}
        </Container>
      </header>

      <section className="bg-ivory pt-4 pb-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          {articles.length > 0 ? (
            <FilteredArticleList articles={articles} />
          ) : (
            <p className="border border-dashed border-line-strong p-10 text-center font-sans text-body">
              The intelligence desk is quiet for now — new research and briefings will appear here.
            </p>
          )}
        </Container>
      </section>
    </CategoryFilterProvider>
  )
}
