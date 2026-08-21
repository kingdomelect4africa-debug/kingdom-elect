import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'

export const revalidate = 60

async function getStory(slug: string) {
  return prisma.story.findUnique({
    where: { slug },
    include: { personFeatured: true, relatedProgram: true, relatedEvent: true, relatedChapter: true },
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) return {}
  return { title: story.seoTitle ?? story.title, description: story.seoDescription ?? story.summary }
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story || story.status !== 'PUBLISHED') notFound()

  return (
    <article className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(4.5rem,9vw,8.5rem)]">
      <SetNavTone tone="light" />
      <Container>
        <div className="mx-auto max-w-[680px]">
          <Kicker>
            {story.personFeatured.firstName} {story.personFeatured.lastName}
            {story.personFeatured.title ? ` · ${story.personFeatured.title}` : ''}
          </Kicker>
          <h1 className="mt-4 font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">{story.title}</h1>
          <p className="mt-5 font-sans text-[1.1rem] text-body">{story.summary}</p>

          <div className="mt-10 whitespace-pre-line border-t border-line pt-10 font-sans text-[1.05rem] leading-[1.85] text-body">
            {story.body}
          </div>

          {(story.relatedProgram || story.relatedEvent || story.relatedChapter) && (
            <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
              {story.relatedProgram && (
                <a
                  href={`/programs/${story.relatedProgram.slug}`}
                  className="rounded-[var(--radius-sm)] border border-line-strong px-4 py-2 font-sans text-[0.76rem] font-semibold uppercase text-ink transition-colors hover:border-gold-dark"
                  style={{ letterSpacing: '0.06em' }}
                >
                  Program: {story.relatedProgram.title}
                </a>
              )}
              {story.relatedEvent && (
                <a
                  href={`/events/${story.relatedEvent.slug}`}
                  className="rounded-[var(--radius-sm)] border border-line-strong px-4 py-2 font-sans text-[0.76rem] font-semibold uppercase text-ink transition-colors hover:border-gold-dark"
                  style={{ letterSpacing: '0.06em' }}
                >
                  Event: {story.relatedEvent.title}
                </a>
              )}
              {story.relatedChapter && (
                <a
                  href={`/chapters/${story.relatedChapter.slug}`}
                  className="rounded-[var(--radius-sm)] border border-line-strong px-4 py-2 font-sans text-[0.76rem] font-semibold uppercase text-ink transition-colors hover:border-gold-dark"
                  style={{ letterSpacing: '0.06em' }}
                >
                  Chapter: {story.relatedChapter.name}
                </a>
              )}
            </div>
          )}
        </div>
      </Container>
    </article>
  )
}
