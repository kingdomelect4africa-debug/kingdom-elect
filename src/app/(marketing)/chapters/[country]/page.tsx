import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'
import { HeroFacts, PageHero } from '@/components/marketing/PageHero'
import { EventCard } from '@/components/marketing/EventCard'
import { Reveal } from '@/components/motion/primitives'
import { formatDate } from '@/lib/format'

export const revalidate = 60

const STATUS_LABELS: Record<string, string> = { ACTIVE: 'Active Chapter', FORMING: 'Forming', PLANNED: 'Planned' }

async function getChapter(slug: string) {
  return prisma.chapter.findUnique({
    where: { slug },
    include: {
      leadPerson: true,
      events: {
        where: { status: 'PUBLISHED' },
        orderBy: { startDate: 'asc' },
        select: {
          title: true, slug: true, type: true, summary: true, startDate: true, endDate: true,
          venueCity: true, venueCountry: true, isVirtual: true, registrationStatus: true,
        },
      },
      _count: { select: { members: true } },
    },
  })
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  const chapter = await getChapter(country)
  if (!chapter) return {}
  return { title: chapter.seoTitle ?? `${chapter.name} Chapter`, description: chapter.seoDescription ?? chapter.description ?? undefined }
}

export default async function ChapterPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const chapter = await getChapter(country)
  if (!chapter) notFound()

  const infoItems = [
    chapter.leadPerson && {
      label: 'Chapter Lead',
      value: `${chapter.leadPerson.firstName} ${chapter.leadPerson.lastName}`,
    },
    { label: 'Members', value: String(chapter._count.members) },
    chapter.launchDate && { label: 'Launched', value: formatDate(chapter.launchDate) },
    chapter.contactEmail && { label: 'Contact', value: chapter.contactEmail },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <SetNavTone tone="dark" />
      <PageHero id="chapter" eyebrow={STATUS_LABELS[chapter.status] ?? chapter.status} title={chapter.name} intro={chapter.description} motif="network">
        <HeroFacts facts={infoItems} />
      </PageHero>

      <section className="bg-ivory-dim py-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <Reveal>
            <Kicker>Chapter Events</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ink">Where this chapter gathers.</h2>
          </Reveal>
          {chapter.events.length > 0 ? (
            <div className="mt-8 divide-y divide-line border-t border-line">
              {chapter.events.map((event, i) => (
                <Reveal key={event.slug} delay={Math.min(i, 5) * 0.06} y={18}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.1}>
              <p className="mt-8 border-t border-line py-8 font-sans text-body">No chapter events have been published yet.</p>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  )
}
