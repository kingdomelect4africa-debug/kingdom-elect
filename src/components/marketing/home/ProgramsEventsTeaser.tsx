import { LinkArrow } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/primitives'
import { ProgramCard } from '@/components/marketing/ProgramCard'
import { EventCard } from '@/components/marketing/EventCard'
import type { Program, Event } from '@prisma/client'

// The cards rule themselves off from the one above; wrapped one per reveal,
// every card looks "first", so the rule is restored for all but the first.
const CARD = '[&+&>div]:border-t [&+&>div]:border-line'

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
        <div className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)]">
          <Reveal className="mb-8 flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-[clamp(1.4rem,2.2vw,1.7rem)] font-semibold text-ink">Pathways for the called</h3>
            <LinkArrow href="/programs" className="shrink-0 whitespace-nowrap text-[0.75rem]">
              All programs
            </LinkArrow>
          </Reveal>
          {programs.length > 0 ? (
            programs.map((program, i) => (
              <Reveal key={program.slug} delay={0.08 + i * 0.08} y={18} className={CARD}>
                <ProgramCard program={program} />
              </Reveal>
            ))
          ) : (
            <p className="font-sans text-body">New programs are in development. Check back soon.</p>
          )}
        </div>

        <div className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)]">
          <Reveal className="mb-8 flex items-baseline justify-between gap-4" delay={0.1}>
            <h3 className="font-serif text-[clamp(1.4rem,2.2vw,1.7rem)] font-semibold text-ink">Where the work gets done</h3>
            <LinkArrow href="/events" className="shrink-0 whitespace-nowrap text-[0.75rem]">
              All events
            </LinkArrow>
          </Reveal>
          {events.length > 0 ? (
            events.map((event, i) => (
              <Reveal key={event.slug} delay={0.16 + i * 0.08} y={18} className={CARD}>
                <EventCard event={event} />
              </Reveal>
            ))
          ) : (
            <p className="font-sans text-body">Your next gathering has not been published yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}
