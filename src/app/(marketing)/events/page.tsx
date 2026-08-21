import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker, LinkArrow } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { SetNavTone } from '@/components/marketing/NavTone'
import { EventCard } from '@/components/marketing/EventCard'
import { formatDateRange } from '@/lib/format'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past gatherings from Kingdom E.L.E.C.T. for Africa, including The Situation Room.',
}

const TYPE_LABELS: Record<string, string> = {
  SITUATION_ROOM: 'The Situation Room',
  REGIONAL_SUMMIT: 'Regional Summit',
  CHAPTER_MEETUP: 'Chapter Meetup',
  WEBINAR: 'Webinar',
  TRAINING: 'Training',
}

export default async function EventsPage() {
  const now = new Date()
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { status: 'PUBLISHED', endDate: { gte: now } },
      orderBy: { startDate: 'asc' },
      select: {
        title: true, slug: true, type: true, summary: true, startDate: true, endDate: true,
        venueName: true, venueCity: true, venueCountry: true, isVirtual: true, registrationStatus: true,
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

  const [featured, ...rest] = upcoming

  return (
    <>
      <SetNavTone tone="light" />

      <section className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <Container>
          <Kicker>Events</Kicker>
          <h1 className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            Where the work gets done.
          </h1>
          <p className="mt-5 max-w-[560px] font-sans text-[1.05rem] leading-[1.8] text-body">
            Gatherings that convene the five spheres to diagnose, deliberate, and deploy Kingdom solutions for
            Africa — not conferences, working sessions.
          </p>
        </Container>
      </section>

      <section className="bg-ivory pt-4 pb-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <Kicker>Upcoming</Kicker>

          {featured ? (
            <div className="mt-7 grid overflow-hidden rounded-[var(--radius-md)] border border-line md:grid-cols-2">
              <div
                className="relative min-h-[260px] md:min-h-[340px]"
                style={{
                  backgroundImage:
                    'linear-gradient(140deg, var(--color-emerald), var(--color-navy-mid) 60%, var(--color-gold-dark))',
                  backgroundSize: '220% 220%',
                  animation: 'mediashift 12s ease infinite',
                }}
              />
              <div className="flex flex-col justify-center p-[clamp(2rem,4vw,3rem)]">
                <span
                  className="mb-[0.8rem] block font-sans text-[0.68rem] font-bold uppercase text-emerald"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {TYPE_LABELS[featured.type] ?? featured.type}
                </span>
                <h3 className="font-serif text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold text-ink">{featured.title}</h3>
                <p className="mt-4 font-sans leading-[1.8] text-body">{featured.summary}</p>
                <div className="mt-[1.4rem] flex flex-wrap gap-6">
                  <div className="font-sans text-[0.82rem] text-body">
                    <strong className="block font-sans text-[0.92rem] font-semibold text-ink">
                      {formatDateRange(featured.startDate, featured.endDate)}
                    </strong>
                    Dates
                  </div>
                  <div className="font-sans text-[0.82rem] text-body">
                    <strong className="block font-sans text-[0.92rem] font-semibold text-ink">
                      {featured.isVirtual ? 'Virtual' : featured.venueName || featured.venueCity || 'TBA'}
                    </strong>
                    Location
                  </div>
                  <div className="font-sans text-[0.82rem] text-body">
                    <strong className="block font-sans text-[0.92rem] font-semibold text-ink">
                      {TYPE_LABELS[featured.type] ?? featured.type}
                    </strong>
                    Category
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-6">
                  <Button href={`/events/${featured.slug}`} variant="navy">
                    {featured.registrationStatus === 'CLOSED' ? 'View Details' : `Register for ${featured.title}`}
                  </Button>
                  <LinkArrow href={`/events/${featured.slug}`}>Learn more</LinkArrow>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-7 rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-[0.95rem] text-body">
              Your next gathering has not been published yet.
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-10 divide-y divide-line border-t border-line">
              {rest.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-ivory-dim py-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <Kicker>Past Events</Kicker>
          <h2 className="mt-4 font-serif text-[clamp(1.6rem,3vw,2.3rem)] font-semibold text-ink">
            An institutional archive, building from here.
          </h2>
          {past.length > 0 ? (
            <div className="mt-8 divide-y divide-line border-t border-line">
              {past.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-[0.95rem] text-body">
              The Situation Room 2026 is our inaugural gathering. Past events will be archived here as the chamber
              convenes.
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
