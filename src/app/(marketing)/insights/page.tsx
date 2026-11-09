import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { SetNavTone } from '@/components/marketing/NavTone'
import { PageHero } from '@/components/marketing/PageHero'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { Reveal } from '@/components/motion/primitives'
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
      <SetNavTone tone="dark" />
      <PageHero
        id="insights"
        eyebrow="Kingdom Intelligence"
        title="Research, briefings, and strategic perspective."
        intro="Perspective for those who govern spheres, not just administer functions."
        motif="grid"
      >
        {articles.length > 0 && <CategoryPills categories={categories} />}
      </PageHero>

      <section className="bg-ivory py-[clamp(3.5rem,7vw,6rem)]">
        <Container>
          {articles.length > 0 ? (
            <FilteredArticleList articles={articles} />
          ) : (
            <Reveal className="relative overflow-hidden rounded-[var(--radius-md)] border border-line bg-ivory-dim/50 px-[clamp(1.5rem,4vw,3rem)] py-[clamp(2.5rem,5vw,3.5rem)]">
              <div className="absolute inset-0 text-gold-dark opacity-[0.09] [mask-image:linear-gradient(270deg,black,transparent_65%)]" aria-hidden="true">
                <KingdomGrid id="insights-empty-grid" className="h-full w-full" />
              </div>
              <p className="relative max-w-[460px] font-serif text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-ink">
                The intelligence desk is quiet for now. New research and briefings will appear here.
              </p>
            </Reveal>
          )}
        </Container>
      </section>
    </CategoryFilterProvider>
  )
}
