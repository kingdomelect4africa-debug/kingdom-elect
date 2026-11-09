import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Kicker, LinkArrow } from '@/components/ui/Section'
import { Reveal, SplitWords } from '@/components/motion/primitives'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { formatDateRange, countryName } from '@/lib/format'
import { EventPanel, ExpandingBand, InfluenceLines } from './SituationRoomBand'

export function SituationRoomTeaser({
  heading,
  body,
  event,
}: {
  heading: string
  body: string
  event: { title: string; slug: string; startDate: Date; endDate: Date; venueCity: string | null; venueCountry: string | null } | null
}) {
  const venue = event?.venueCity ? [event.venueCity, countryName(event.venueCountry)].filter(Boolean).join(', ') : null

  return (
    <section className="bg-ivory">
      <ExpandingBand className="relative isolate overflow-hidden bg-emerald py-[clamp(5rem,10vw,9rem)] text-ivory">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(90% 80% at 100% 100%, rgba(29,89,64,0.9), transparent 60%), radial-gradient(60% 60% at 0% 0%, rgba(7,24,17,0.55), transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 text-ivory opacity-[0.05] [mask-image:linear-gradient(110deg,black,transparent_55%)]"
          aria-hidden="true"
        >
          <KingdomGrid id="situation-room-grid" className="h-full w-full" />
        </div>
        <InfluenceLines className="absolute bottom-0 right-0 -z-10 h-[70%] w-full max-w-[620px] lg:h-full lg:w-[48%] lg:max-w-none" />

        <Container>
          <div className="grid items-center gap-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <Kicker onDark>A Governance Chamber</Kicker>
              </Reveal>
              <h2 className="mt-5 font-serif text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.06] text-ivory">
                <SplitWords text={heading} inView delay={0.1} />
              </h2>
              <Reveal delay={0.25}>
                <p className="mt-6 max-w-[500px] font-sans leading-[1.85] text-ivory/80">{body}</p>
                <div className="mt-7">
                  <LinkArrow href="/the-situation-room" onDark>
                    Learn more
                  </LinkArrow>
                </div>
              </Reveal>
            </div>

            {event ? (
              <EventPanel
                startsAt={event.startDate.toISOString()}
                action={
                  <Button href="/the-situation-room/register" variant="gold" size="sm">
                    Enter the Situation Room
                  </Button>
                }
              >
                <span className="font-sans text-[0.68rem] font-bold uppercase text-gold-light" style={{ letterSpacing: '0.12em' }}>
                  Upcoming · {formatDateRange(event.startDate, event.endDate)}
                </span>
                <h3 className="mt-3 font-serif text-[clamp(1.3rem,2.2vw,1.6rem)] font-semibold text-ivory">{event.title}</h3>
                {venue && <p className="mt-1 font-sans text-[0.9rem] text-ivory/70">{venue}</p>}
              </EventPanel>
            ) : (
              <Reveal className="rounded-[var(--radius-md)] border border-ivory/20 bg-ivory/[0.06] p-7 backdrop-blur-md">
                <p className="font-sans text-[0.9rem] text-ivory/75">The next convening has not been published yet.</p>
                <div className="mt-6">
                  <Button href="/the-situation-room" variant="gold" size="sm">
                    Learn More
                  </Button>
                </div>
              </Reveal>
            )}
          </div>
        </Container>
      </ExpandingBand>
    </section>
  )
}
