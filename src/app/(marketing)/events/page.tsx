import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker, LinkArrow } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { SetNavTone } from '@/components/marketing/NavTone'
import { PageHero } from '@/components/marketing/PageHero'
import { FeatureVisual } from '@/components/marketing/FeatureVisual'
import { EventCard } from '@/components/marketing/EventCard'
import { Countdown } from '@/components/marketing/home/SituationRoomBand'
import { Reveal } from '@/components/motion/primitives'
import { formatDateRange } from '@/lib/format'

const dayFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric' })
const monthYearFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })

/** "26–29" for a run of days in one month, otherwise just the first day. */
function dayRange(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  return sameMonth && start.getDate() !== end.getDate() ? `${dayFormat.format(start)}–${dayFormat.format(end)}` : dayFormat.format(start)
}

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
      <SetNavTone tone="dark" />
      <PageHero
        id="events"
        eyebrow="Events"
        title="Where the work gets done."
        intro="Gatherings that convene the five spheres to diagnose, deliberate, and deploy Kingdom solutions for Africa. Not conferences: working sessions."
        motif="arcs"
      />

      <section className="bg-ivory py-[clamp(4rem,8vw,6.5rem)]">
        <Container>
          <Reveal>
            <Kicker>Upcoming</Kicker>
          </Reveal>

          {featured ? (
            <Reveal
              delay={0.08}
              className="group mt-7 grid overflow-hidden rounded-[var(--radius-md)] border border-line bg-ivory shadow-[0_30px_70px_-45px_rgba(11,31,58,0.45)] md:grid-cols-[0.95fr_1.05fr]"
            >
              <FeatureVisual id="events-featured" motif="arcs" className="flex min-h-[300px] flex-col justify-end p-[clamp(1.75rem,3.5vw,2.5rem)] md:min-h-[380px]">
                <div className="font-serif text-[clamp(3rem,6vw,4.6rem)] font-semibold leading-none text-ivory">
                  {dayRange(featured.startDate, featured.endDate)}
                </div>
                <div className="mt-2 font-sans text-[0.72rem] font-semibold uppercase text-gold-light" style={{ letterSpacing: '0.14em' }}>
                  {monthYearFormat.format(featured.startDate)}
                </div>
                <Countdown startsAt={featured.startDate.toISOString()} className="mt-7 max-w-[420px]" />
              </FeatureVisual>
              <div className="flex flex-col justify-center p-[clamp(2rem,4vw,3rem)]">
                <span className="mb-[0.8rem] block font-sans text-[0.68rem] font-bold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
                  {TYPE_LABELS[featured.type] ?? featured.type}
                </span>
                <h2 className="font-serif text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15] text-ink">{featured.title}</h2>
                <p className="mt-4 font-sans leading-[1.8] text-body">{featured.summary}</p>
                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
                  {[
                    { label: 'Dates', value: formatDateRange(featured.startDate, featured.endDate) },
                    { label: 'Location', value: featured.isVirtual ? 'Virtual' : featured.venueName || featured.venueCity || 'TBA' },
                  ].map((fact) => (
                    <div key={fact.label} className="flex flex-col-reverse font-sans">
                      <dt className="text-[0.78rem] text-body">{fact.label}</dt>
                      <dd className="text-[0.92rem] font-semibold text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <Button href={`/events/${featured.slug}`} variant="navy">
                    {featured.registrationStatus === 'CLOSED' ? 'View Details' : 'Register Now'}
                  </Button>
                  <LinkArrow href={`/events/${featured.slug}`}>Learn more</LinkArrow>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal className="mt-7 rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-[0.95rem] text-body">
              Your next gathering has not been published yet.
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="mt-12 divide-y divide-line border-t border-line">
              {rest.map((event, i) => (
                <Reveal key={event.slug} delay={Math.min(i, 5) * 0.06} y={18}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-ivory-dim py-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <Reveal>
            <Kicker>Past Events</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1.15] text-ink">
              An institutional archive, building from here.
            </h2>
          </Reveal>
          {past.length > 0 ? (
            <div className="mt-8 divide-y divide-line border-t border-line">
              {past.map((event, i) => (
                <Reveal key={event.slug} delay={Math.min(i, 5) * 0.06} y={18}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.1} className="mt-8 rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-[0.95rem] text-body">
              The Situation Room 2026 is our inaugural gathering. Past events will be archived here as the chamber convenes.
            </Reveal>
          )}
        </Container>
      </section>
    </>
  )
}
