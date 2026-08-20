import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { EventCard } from '@/components/marketing/EventCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past gatherings from Kingdom E.L.E.C.T. for Africa, including The Situation Room.',
}

export default async function EventsPage() {
  const now = new Date()
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { status: 'PUBLISHED', endDate: { gte: now } },
      orderBy: { startDate: 'asc' },
      select: {
        title: true, slug: true, type: true, summary: true, startDate: true, endDate: true,
        venueCity: true, venueCountry: true, isVirtual: true, registrationStatus: true,
      },
    }),
    prisma.event.findMany({
      where: { status: 'PUBLISHED', endDate: { lt: now } },
      orderBy: { startDate: 'desc' },
      select: {
        title: true, slug: true, type: true, summary: true, startDate: true, endDate: true,
        venueCity: true, venueCountry: true, isVirtual: true, registrationStatus: true,
      },
    }),
  ])

  return (
    <>
      <section className="bg-surface pb-16 pt-40 md:pt-48">
        <Container>
          <Eyebrow>Events</Eyebrow>
          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
            Where the work gets done.
          </h1>
        </Container>
      </section>

      <section className="bg-surface pb-24 md:pb-32">
        <Container>
          <h2 className="font-sans text-xs font-semibold uppercase text-brand-secondary" style={{ letterSpacing: 'var(--tracking-label)' }}>
            Upcoming
          </h2>
          {upcoming.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-8 border border-border-subtle p-10 text-center font-sans text-ink-muted">
              Your next gathering has not been published yet.
            </p>
          )}

          {past.length > 0 && (
            <div className="mt-20">
              <h2 className="font-sans text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: 'var(--tracking-label)' }}>
                Past
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-70">
                {past.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
