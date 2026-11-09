import { Container } from '@/components/ui/Container'
import { LinkArrow } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/primitives'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { ArticleCard } from '@/components/marketing/ArticleCard'
import type { Article } from '@prisma/client'

export function IntelligenceTeaser({
  heading,
  articles,
}: {
  heading: string
  articles: Pick<Article, 'title' | 'slug' | 'subtitle' | 'excerpt' | 'category' | 'publishedDate'>[]
}) {
  return (
    <section className="bg-ivory py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-[clamp(2rem,3.8vw,3rem)] font-semibold leading-[1.1] text-ink">{heading}</h2>
          <LinkArrow href="/insights">View all intelligence</LinkArrow>
        </Reveal>

        {articles.length > 0 ? (
          <div className="mt-10">
            {articles.map((article, i) => (
              // Each card draws its own top rule; only the last keeps its bottom one.
              <Reveal key={article.slug} delay={i * 0.08} y={18} className="[&:not(:last-child)>a]:border-b-0">
                <ArticleCard article={article} showCategory />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="relative mt-10 overflow-hidden rounded-[var(--radius-md)] border border-line bg-ivory-dim/50 px-[clamp(1.5rem,4vw,3rem)] py-[clamp(2.5rem,5vw,3.5rem)]">
            <div className="absolute inset-0 text-gold-dark opacity-[0.09] [mask-image:linear-gradient(270deg,black,transparent_65%)]" aria-hidden="true">
              <KingdomGrid id="intelligence-empty-grid" className="h-full w-full" />
            </div>
            <p className="relative max-w-[460px] font-serif text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-ink">
              The intelligence desk is quiet for now. New research and briefings will appear here.
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
