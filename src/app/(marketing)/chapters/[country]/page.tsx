import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
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

  return (
    <>
      <section className="bg-brand-primary pb-16 pt-40 text-ink-inverse md:pt-48">
        <Container>
          <Eyebrow>{STATUS_LABELS[chapter.status] ?? chapter.status}</Eyebrow>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            {chapter.name}
          </h1>
          {chapter.description && (
            <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-ivory-500/85">{chapter.description}</p>
          )}

          <div className="mt-10 flex flex-wrap gap-8 border-t border-white/15 pt-8 font-sans text-sm">
            {chapter.leadPerson && (
              <div>
                <p className="text-xs uppercase text-ivory-700" style={{ letterSpacing: '0.06em' }}>Chapter Lead</p>
                <p className="mt-1 text-ivory-500">
                  {chapter.leadPerson.firstName} {chapter.leadPerson.lastName}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase text-ivory-700" style={{ letterSpacing: '0.06em' }}>Members</p>
              <p className="mt-1 text-ivory-500">{chapter._count.members}</p>
            </div>
            {chapter.launchDate && (
              <div>
                <p className="text-xs uppercase text-ivory-700" style={{ letterSpacing: '0.06em' }}>Launched</p>
                <p className="mt-1 text-ivory-500">{formatDate(chapter.launchDate)}</p>
              </div>
            )}
            {chapter.contactEmail && (
              <div>
                <p className="text-xs uppercase text-ivory-700" style={{ letterSpacing: '0.06em' }}>Contact</p>
                <p className="mt-1 text-ivory-500">{chapter.contactEmail}</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-24 md:py-32">
        <Container>
          <h2 className="font-serif text-2xl font-medium text-brand-primary">Chapter Events</h2>
          {chapter.events.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {chapter.events.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-8 font-sans text-ink-muted">No chapter events have been published yet.</p>
          )}
        </Container>
      </section>
    </>
  )
}
