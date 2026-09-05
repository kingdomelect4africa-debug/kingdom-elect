import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Kicker, LinkArrow } from '@/components/ui/Section'
import { formatDateRange, countryName } from '@/lib/format'

export function SituationRoomTeaser({
  heading,
  body,
  event,
}: {
  heading: string
  body: string
  event: { title: string; slug: string; startDate: Date; endDate: Date; venueCity: string | null; venueCountry: string | null } | null
}) {
  return (
    <section className="relative overflow-hidden bg-emerald py-[clamp(4.5rem,9vw,8.5rem)] text-ivory">
      <Container>
        <div className="grid items-center gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Kicker onDark>A Governance Chamber</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ivory">{heading}</h2>
            <p className="mt-[1.1rem] max-w-[480px] font-sans leading-[1.85] text-ivory/78">{body}</p>
            <div className="mt-6">
              <LinkArrow href="/the-situation-room" onDark>Learn more</LinkArrow>
            </div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-ivory/22 bg-ivory/5 p-7">
            {event ? (
              <>
                <span className="font-sans text-[0.68rem] font-bold uppercase text-gold-light" style={{ letterSpacing: '0.1em' }}>
                  Upcoming · {formatDateRange(event.startDate, event.endDate)}
                </span>
                <h4 className="mt-[0.7rem] font-serif text-[1.15rem] text-ivory">{event.title}</h4>
                {event.venueCity && (
                  <div className="mt-[0.4rem] font-sans text-[0.85rem] text-ivory/65">
                    {event.venueCity}
                    {event.venueCountry ? `, ${countryName(event.venueCountry)}` : ''}
                  </div>
                )}
                <div className="mt-6">
                  <Button href="/the-situation-room/register" variant="gold" size="sm">
                    Enter the Situation Room
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="font-sans text-[0.9rem] text-ivory/70">The next convening has not been published yet.</p>
                <div className="mt-6">
                  <Button href="/the-situation-room" variant="gold" size="sm">
                    Learn More
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
