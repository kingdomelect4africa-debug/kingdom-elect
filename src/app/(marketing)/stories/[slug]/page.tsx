import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'

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
    <article className="bg-surface pb-24 pt-40 md:pb-32 md:pt-48">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>
            {story.personFeatured.firstName} {story.personFeatured.lastName}
            {story.personFeatured.title ? ` · ${story.personFeatured.title}` : ''}
          </Eyebrow>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-brand-primary md:text-5xl">
            {story.title}
          </h1>
          <p className="mt-6 font-sans text-xl leading-relaxed text-ink-muted">{story.summary}</p>

          <div className="mt-10 whitespace-pre-line border-t border-border-subtle pt-10 font-sans text-lg leading-relaxed text-ink">
            {story.body}
          </div>

          {(story.relatedProgram || story.relatedEvent || story.relatedChapter) && (
            <div className="mt-12 flex flex-wrap gap-3 border-t border-border-subtle pt-8">
              {story.relatedProgram && (
                <a href={`/programs/${story.relatedProgram.slug}`} className="border border-border-strong px-4 py-2 font-sans text-xs uppercase text-brand-primary hover:border-brand-accent">
                  Program: {story.relatedProgram.title}
                </a>
              )}
              {story.relatedEvent && (
                <a href={`/events/${story.relatedEvent.slug}`} className="border border-border-strong px-4 py-2 font-sans text-xs uppercase text-brand-primary hover:border-brand-accent">
                  Event: {story.relatedEvent.title}
                </a>
              )}
              {story.relatedChapter && (
                <a href={`/chapters/${story.relatedChapter.slug}`} className="border border-border-strong px-4 py-2 font-sans text-xs uppercase text-brand-primary hover:border-brand-accent">
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
