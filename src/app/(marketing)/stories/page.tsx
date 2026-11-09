import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { SetNavTone } from '@/components/marketing/NavTone'
import { PageHero } from '@/components/marketing/PageHero'
import { Reveal } from '@/components/motion/primitives'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Transformation, one person at a time — stories from the Kingdom E.L.E.C.T. community.',
}

const GRADIENTS = [
  'linear-gradient(140deg, var(--color-navy-deep), var(--color-navy-mid) 55%, var(--color-gold-dark))',
  'linear-gradient(140deg, var(--color-emerald), var(--color-navy-mid) 60%, var(--color-gold-dark))',
  'linear-gradient(140deg, var(--color-navy-mid), var(--color-emerald) 55%, var(--color-gold))',
  'linear-gradient(140deg, var(--color-navy-deep), var(--color-gold-dark) 130%)',
]

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedDate: 'desc' },
    include: { personFeatured: { select: { firstName: true, lastName: true, title: true } } },
  })

  return (
    <>
      <SetNavTone tone="dark" />
      <PageHero id="stories" eyebrow="Stories" title="Transformation, one person at a time." motif="arcs" />

      <section className="bg-ivory py-[clamp(4rem,8vw,6.5rem)]">
        <Container>
          {stories.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, i) => (
                <Reveal key={story.slug} delay={(i % 3) * 0.1}>
                  <Link
                    href={`/stories/${story.slug}`}
                    className="group relative isolate block aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] shadow-[0_24px_60px_-40px_rgba(11,31,58,0.6)]"
                  >
                    <div
                      className="absolute inset-0 animate-[mediashift_12s_ease_infinite] bg-[length:220%_220%] transition-transform duration-[1.2s] ease-[var(--ease-signature)] group-hover:scale-[1.06]"
                      style={{ backgroundImage: GRADIENTS[i % GRADIENTS.length] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-navy-deep/92" />
                    <div className="absolute inset-x-0 bottom-0 p-[1.6rem] transition-transform duration-500 ease-[var(--ease-signature)] group-hover:-translate-y-1">
                      <span className="font-sans text-[0.68rem] font-bold uppercase text-gold-light" style={{ letterSpacing: '0.1em' }}>
                        {story.personFeatured.title ?? 'Story'}
                      </span>
                      <h3 className="mt-2 font-serif text-[1.2rem] font-semibold text-ivory">{story.title}</h3>
                      <p className="mt-1 font-sans text-[0.85rem] text-ivory/75">
                        {story.personFeatured.firstName} {story.personFeatured.lastName}: {story.summary}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-body">
              No stories have been published yet.
            </Reveal>
          )}
        </Container>
      </section>
    </>
  )
}
