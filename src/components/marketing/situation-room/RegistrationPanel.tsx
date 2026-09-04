import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { formatDateRange, countryName } from '@/lib/format'

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
    <section className="bg-ivory-dim py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container className="max-w-[640px] text-center">
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-line-strong">
          <div className="flex flex-col justify-center px-[clamp(2rem,4vw,3rem)] py-[clamp(2rem,4vw,3rem)]">
            {event ? (
              <>
                <span
                  className="inline-block text-center font-sans text-[0.68rem] font-bold uppercase text-emerald"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {formatDateRange(event.startDate, event.endDate)}
                </span>
                <h3 className="mt-[0.6rem] font-serif text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold text-ink">
                  {event.title}
                </h3>
                <p className="mx-auto mt-4 max-w-[420px] font-sans leading-[1.8] text-body">
                  {event.isVirtual
                    ? 'Virtual Convening'
                    : [event.venueName, event.venueCity, countryName(event.venueCountry)].filter(Boolean).join(', ')}
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                  <Button href="/the-situation-room/register" variant="navy">
                    {event.registrationStatus === 'CLOSED' ? 'Registration Closed' : 'Register for The Situation Room'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-serif text-[1.5rem] font-semibold text-ink">
                  The next convening has not been published yet.
                </h3>
                <p className="mx-auto mt-4 max-w-[420px] font-sans leading-[1.8] text-body">
                  Sign up for Kingdom Intelligence to be notified the moment registration opens.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                  <Button href="/get-involved" variant="navy">
                    Get Involved
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
