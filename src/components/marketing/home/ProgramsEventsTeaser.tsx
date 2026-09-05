import { LinkArrow } from '@/components/ui/Section'
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
    <section className="bg-ivory-dim">
      <div className="mx-auto grid max-w-[1240px] divide-y divide-line lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,5vw,4rem)]">
          <div className="mb-8 flex items-baseline justify-between">
            <h3 className="font-serif text-[1.4rem] font-semibold text-ink">Pathways for the called</h3>
            <LinkArrow href="/programs" className="text-[0.75rem]">All programs</LinkArrow>
          </div>
          {programs.length > 0 ? (
            programs.map((program) => <ProgramCard key={program.slug} program={program} />)
          ) : (
            <p className="font-sans text-body">New programs are in development. Check back soon.</p>
          )}
        </div>

        <div className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,5vw,4rem)]">
          <div className="mb-8 flex items-baseline justify-between">
            <h3 className="font-serif text-[1.4rem] font-semibold text-ink">Where the work gets done</h3>
            <LinkArrow href="/events" className="text-[0.75rem]">All events</LinkArrow>
          </div>
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.slug} event={event} />)
          ) : (
            <p className="font-sans text-body">Your next gathering has not been published yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}
