import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Section'
import { NetworkLines } from '@/components/devices/NetworkLines'
import { formatDateRange } from '@/lib/format'

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
    <section className="relative overflow-hidden bg-emerald-900 py-24 text-ink-inverse md:py-32">
      <NetworkLines className="absolute right-0 top-1/2 h-[320px] w-[420px] -translate-y-1/2 text-white opacity-60" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>A Governance Chamber</Eyebrow>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight md:text-5xl">{heading}</h2>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-ivory-500/85">{body}</p>
          </div>

          <div className="border-t border-white/15 pt-8 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {event ? (
              <>
                <p className="font-sans text-xs font-semibold uppercase text-brand-accent" style={{ letterSpacing: 'var(--tracking-label)' }}>
                  {formatDateRange(event.startDate, event.endDate)}
                </p>
                <p className="mt-2 font-serif text-2xl">{event.title}</p>
                {event.venueCity && (
                  <p className="mt-1 font-sans text-sm text-ivory-500/70">
                    {event.venueCity}
                    {event.venueCountry ? `, ${event.venueCountry}` : ''}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button href={`/events/${event.slug}`} variant="gold">
                    Enter the Situation Room
                  </Button>
                  <Button href="/the-situation-room" variant="ghost">
                    Learn More
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="font-sans text-sm text-ivory-500/70">The next convening has not been published yet.</p>
                <div className="mt-6">
                  <Button href="/the-situation-room" variant="gold">
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
