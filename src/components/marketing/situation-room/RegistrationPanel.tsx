import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Kicker } from '@/components/ui/Section'
import { Reveal, SplitWords } from '@/components/motion/primitives'
import { InfluenceLines } from '@/components/devices/InfluenceLines'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { EventPanel, ExpandingBand } from '@/components/marketing/home/SituationRoomBand'
import { formatDateRange, countryName } from '@/lib/format'

/**
 * The closing call to register: the same emerald band and live countdown as
 * the homepage's Situation Room section.
 */
export function RegistrationPanel({
  event,
}: {
  event: {
    slug: string
    title: string
    startDate: Date
    endDate: Date
    venueName: string | null
    venueCity: string | null
    venueCountry: string | null
    isVirtual: boolean
    capacity: number | null
    registrationStatus: string
  } | null
}) {
  const closed = event?.registrationStatus === 'CLOSED'
  const venue = event
    ? event.isVirtual
      ? 'Virtual convening'
      : [event.venueName, event.venueCity, countryName(event.venueCountry)].filter(Boolean).join(', ')
    : null

  return (
    <section className="bg-navy-deep">
      <ExpandingBand className="relative isolate overflow-hidden bg-emerald py-[clamp(5rem,10vw,8.5rem)] text-ivory">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(90% 80% at 100% 100%, rgba(29,89,64,0.9), transparent 60%), radial-gradient(60% 60% at 0% 0%, rgba(7,24,17,0.55), transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 text-ivory opacity-[0.05] [mask-image:linear-gradient(110deg,black,transparent_55%)]" aria-hidden="true">
          <KingdomGrid id="situation-room-register-grid" className="h-full w-full" />
        </div>
        <InfluenceLines className="absolute bottom-0 right-0 -z-10 h-[70%] w-full max-w-[620px] lg:h-full lg:w-[48%] lg:max-w-none" />

        <Container>
          <div className="grid items-center gap-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Reveal>
                <Kicker onDark>Registration</Kicker>
              </Reveal>
              <h2 className="mt-5 font-serif text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.08] text-ivory">
                <SplitWords text={event ? 'Take your place in the chamber.' : 'The next convening is being prepared.'} inView delay={0.1} />
              </h2>
              <Reveal delay={0.25}>
                <p className="mt-6 max-w-[480px] font-sans leading-[1.85] text-ivory/80">
                  {event
                    ? 'Educators, Leaders, Entrepreneurs, Creatives and Technocrats convening to diagnose, deliberate and deploy Kingdom solutions for Africa.'
                    : 'Sign up for Kingdom Intelligence to be notified the moment registration opens.'}
                </p>
              </Reveal>
            </div>

            {event ? (
              <EventPanel
                startsAt={event.startDate.toISOString()}
                action={
                  <Button href="/the-situation-room/register" variant="gold" size="sm">
                    {closed ? 'Registration Closed' : 'Register for The Situation Room'}
                  </Button>
                }
              >
                <span className="font-sans text-[0.68rem] font-bold uppercase text-gold-light" style={{ letterSpacing: '0.12em' }}>
                  {formatDateRange(event.startDate, event.endDate)}
                </span>
                <h3 className="mt-3 font-serif text-[clamp(1.3rem,2.2vw,1.6rem)] font-semibold text-ivory">{event.title}</h3>
                {venue && <p className="mt-1 font-sans text-[0.9rem] text-ivory/70">{venue}</p>}
                {event.capacity && <p className="mt-1 font-sans text-[0.82rem] text-ivory/55">{event.capacity} delegates</p>}
              </EventPanel>
            ) : (
              <Reveal className="rounded-[var(--radius-md)] border border-ivory/20 bg-ivory/[0.06] p-7 backdrop-blur-md">
                <p className="font-sans text-[0.9rem] text-ivory/75">Registration has not opened yet.</p>
                <div className="mt-6">
                  <Button href="/get-involved" variant="gold" size="sm">
                    Get Involved
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
