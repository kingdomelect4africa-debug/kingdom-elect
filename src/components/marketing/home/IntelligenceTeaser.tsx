import { Container } from '@/components/ui/Container'
import { Kicker, LinkArrow } from '@/components/ui/Section'
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
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <Kicker>Kingdom Intelligence</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ink">{heading}</h2>
          </div>
          <LinkArrow href="/insights">View all intelligence</LinkArrow>
        </div>

        {articles.length > 0 ? (
          <div className="mt-8">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} showCategory />
            ))}
          </div>
        ) : (
          <p className="mt-8 border-t border-line py-8 font-sans text-body">
            The intelligence desk is quiet for now. New research and briefings will appear here.
          </p>
        )}
      </Container>
    </section>
  )
}
