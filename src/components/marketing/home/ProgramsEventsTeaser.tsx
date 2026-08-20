import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { ProgramCard } from '@/components/marketing/ProgramCard'
import { EventCard } from '@/components/marketing/EventCard'
import type { Program, Event } from '@prisma/client'

export function ProgramsEventsTeaser({
  programs,
  events,
}: {
  programs: Pick<Program, 'title' | 'slug' | 'summary' | 'status'>[]
  events: Pick<Event, 'title' | 'slug' | 'type' | 'summary' | 'startDate' | 'endDate' | 'venueCity' | 'venueCountry' | 'isVirtual' | 'registrationStatus'>[]
}) {
  return (
    <section className="bg-navy-50 py-24 md:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <Eyebrow>Programs</Eyebrow>
                <h2 className="mt-4 font-serif text-3xl font-medium text-brand-primary">Pathways for the called</h2>
              </div>
              <Link href="/programs" className="shrink-0 font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline" style={{ letterSpacing: 'var(--tracking-label)' }}>
                All programs →
              </Link>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              {programs.length > 0 ? (
                programs.map((program) => <ProgramCard key={program.slug} program={program} />)
              ) : (
                <p className="font-sans text-ink-muted">New programs are in development — check back soon.</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <Eyebrow>Events</Eyebrow>
                <h2 className="mt-4 font-serif text-3xl font-medium text-brand-primary">Where the work gets done</h2>
              </div>
              <Link href="/events" className="shrink-0 font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline" style={{ letterSpacing: 'var(--tracking-label)' }}>
                All events →
              </Link>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              {events.length > 0 ? (
                events.map((event) => <EventCard key={event.slug} event={event} />)
              ) : (
                <p className="font-sans text-ink-muted">Your next gathering has not been published yet.</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
