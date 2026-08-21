import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'
import { EventCard } from '@/components/marketing/EventCard'
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
      <SetNavTone tone="light" />

      <section className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <Container>
          <Kicker>{STATUS_LABELS[chapter.status] ?? chapter.status}</Kicker>
          <h1 className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            {chapter.name}
          </h1>
          {chapter.description && (
            <p className="mt-5 max-w-[560px] font-sans text-[1.05rem] leading-[1.8] text-body">{chapter.description}</p>
          )}

          {infoItems.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-8">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <p className="font-sans text-[0.7rem] uppercase text-body" style={{ letterSpacing: '0.1em' }}>
                    {item.label}
                  </p>
                  <p className="mt-1 font-serif text-[1.05rem] text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-ivory-dim py-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <Kicker>Chapter Events</Kicker>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ink">
            Where this chapter gathers.
          </h2>
          {chapter.events.length > 0 ? (
            <div className="mt-8">
              {chapter.events.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-8 border-t border-line py-8 font-sans text-body">No chapter events have been published yet.</p>
          )}
        </Container>
      </section>
    </>
  )
}
