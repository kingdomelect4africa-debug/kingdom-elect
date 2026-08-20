import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { formatDateRange } from '@/lib/format'

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
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl border border-border-strong p-10 text-center md:p-16">
          {event ? (
            <>
              <p className="font-sans text-xs font-semibold uppercase text-brand-secondary" style={{ letterSpacing: 'var(--tracking-label)' }}>
                {formatDateRange(event.startDate, event.endDate)}
              </p>
              <h2 className="mt-4 font-serif text-3xl font-medium text-brand-primary md:text-4xl">{event.title}</h2>
              <p className="mt-3 font-sans text-sm uppercase text-ink-muted" style={{ letterSpacing: '0.06em' }}>
                {event.isVirtual ? 'Virtual Convening' : [event.venueName, event.venueCity, event.venueCountry].filter(Boolean).join(', ')}
              </p>
              <div className="mt-8">
                <Button href={`/events/${event.slug}`} variant="primary" size="lg">
                  {event.registrationStatus === 'CLOSED' ? 'Registration Closed' : 'Register for the Situation Room'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-serif text-2xl text-brand-primary">The next convening has not been published yet.</h2>
              <p className="mt-3 font-sans text-sm text-ink-muted">
                Sign up for Kingdom Intelligence to be notified the moment registration opens.
              </p>
              <div className="mt-8">
                <Button href="/get-involved" variant="primary" size="lg">
                  Get Involved
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  )
}
