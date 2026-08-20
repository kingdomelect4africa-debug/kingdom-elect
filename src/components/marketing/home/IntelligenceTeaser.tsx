import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { ArticleCard } from '@/components/marketing/ArticleCard'
import type { Article } from '@prisma/client'

export function IntelligenceTeaser({
  heading,
  intro,
  articles,
}: {
  heading: string
  intro: string
  articles: Pick<Article, 'title' | 'slug' | 'subtitle' | 'excerpt' | 'category' | 'publishedDate'>[]
}) {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Eyebrow>Kingdom Intelligence</Eyebrow>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-brand-primary md:text-5xl">{heading}</h2>
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted">{intro}</p>
          </div>
          <Link
            href="/insights"
            className="shrink-0 font-sans text-sm font-semibold uppercase text-brand-primary underline-offset-4 hover:underline"
            style={{ letterSpacing: 'var(--tracking-label)' }}
          >
            View all intelligence →
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="mt-14">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="mt-14 border-t border-border-subtle pt-8 font-sans text-ink-muted">
            The intelligence desk is quiet for now — new research and briefings will appear here.
          </p>
        )}
      </Container>
    </section>
  )
}
