import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'

const GRADIENTS = [
  'linear-gradient(140deg, var(--color-navy-deep), var(--color-navy-mid) 55%, var(--color-gold-dark))',
  'linear-gradient(140deg, var(--color-emerald), var(--color-navy-mid) 60%, var(--color-gold-dark))',
  'linear-gradient(140deg, var(--color-navy-mid), var(--color-emerald) 55%, var(--color-gold))',
  'linear-gradient(140deg, var(--color-navy-deep), var(--color-gold-dark) 130%)',
]

type StoryItem = {
  slug: string
  title: string
  summary: string
  personFeatured: { firstName: string; lastName: string; title: string | null }
}

export function StoriesTeaser({ stories }: { stories: StoryItem[] }) {
  if (stories.length === 0) return null

  return (
    <section id="stories" className="bg-ivory py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container>
        <div className="max-w-[560px]">
          <Kicker>Stories</Kicker>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ink">Transformation, one person at a time.</h2>
        </div>

        <div className="mt-9 grid gap-7 sm:grid-cols-2">
          {stories.map((story, i) => (
            <Link key={story.slug} href={`/stories/${story.slug}`} className="group relative isolate aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]">
              <div
                className="absolute inset-0 animate-[mediashift_12s_ease_infinite] bg-[length:220%_220%]"
                style={{ backgroundImage: GRADIENTS[i % GRADIENTS.length] }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-navy-deep/92" />
              <div className="absolute inset-x-0 bottom-0 p-[1.6rem]">
                <span className="font-sans text-[0.68rem] font-bold uppercase text-gold-light" style={{ letterSpacing: '0.1em' }}>
                  {story.personFeatured.title ?? 'Story'}
                </span>
                <h4 className="mt-2 font-serif text-[1.2rem] font-semibold text-ivory">{story.title}</h4>
                <p className="mt-1 font-sans text-[0.85rem] text-ivory/75">
                  {story.personFeatured.firstName} {story.personFeatured.lastName} — {story.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
