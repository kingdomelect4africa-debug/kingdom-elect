import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { RisingForms } from '@/components/devices/RisingForms'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Transformation, one person at a time — stories from the Kingdom E.L.E.C.T. community.',
}

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedDate: 'desc' },
    include: { personFeatured: { select: { firstName: true, lastName: true, title: true } } },
  })

  return (
    <>
      <section className="bg-surface pb-16 pt-40 md:pt-48">
        <Container>
          <Eyebrow>Stories</Eyebrow>
          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
            Transformation, one person at a time.
          </h1>
        </Container>
      </section>

      <section className="bg-surface pb-24 md:pb-32">
        <Container>
          {stories.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
          ) : (
            <p className="border border-border-subtle p-10 text-center font-sans text-ink-muted">
              No stories have been published yet.
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
