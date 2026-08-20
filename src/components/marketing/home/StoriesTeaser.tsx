import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { RisingForms } from '@/components/devices/RisingForms'

type StoryItem = {
  slug: string
  title: string
  summary: string
  personFeatured: { firstName: string; lastName: string; title: string | null }
}

export function StoriesTeaser({ stories }: { stories: StoryItem[] }) {
  if (stories.length === 0) return null

  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <Eyebrow>Stories</Eyebrow>
        <h2 className="mt-5 max-w-xl font-serif text-4xl font-medium leading-tight text-brand-primary md:text-5xl">
          Transformation, one person at a time.
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <Link key={story.slug} href={`/stories/${story.slug}`} className="group flex flex-col">
              <div className="relative flex aspect-[4/3] items-end overflow-hidden bg-emerald-900 p-6">
                <RisingForms className="absolute inset-0 h-full w-full text-white opacity-20" count={4} />
                <p className="relative font-serif text-xl text-ivory-500">
                  {story.personFeatured.firstName} {story.personFeatured.lastName}
                </p>
              </div>
              <h3 className="mt-5 font-serif text-xl font-medium leading-snug text-brand-primary transition-colors group-hover:text-brand-accent">
                {story.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">{story.summary}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
