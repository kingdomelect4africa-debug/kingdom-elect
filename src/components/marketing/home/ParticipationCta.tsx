import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Kicker } from '@/components/ui/Section'
import { NetworkNodes } from '@/components/devices/NetworkNodes'

export function ParticipationCta({
  heading,
  body,
  ctaLabel,
  ctaHref,
}: {
  heading: string
  body: string
  ctaLabel: string
  ctaHref: string
}) {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-[clamp(4rem,8vw,6rem)] text-center text-ivory">
      <NetworkNodes className="absolute inset-0 h-full w-full opacity-55" />
      <Container className="relative">
        <Kicker center>Get Involved</Kicker>
        <h2 className="mx-auto mt-[1.1rem] max-w-[760px] font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold text-ivory">{heading}</h2>
        <p className="mx-auto mt-[1.1rem] max-w-[520px] font-sans text-body-on-navy">{body}</p>
        <div className="mt-8 flex justify-center">
          <Button href={ctaHref} variant="gold">
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  )
}
