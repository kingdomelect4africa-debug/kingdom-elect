import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { NetworkLines } from '@/components/devices/NetworkLines'

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
    <section className="relative overflow-hidden bg-brand-primary py-28 text-ink-inverse md:py-36">
      <NetworkLines className="absolute inset-0 h-full w-full text-white opacity-40" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-4xl font-medium leading-tight md:text-5xl">{heading}</h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ivory-500/85">{body}</p>
          <div className="mt-10 flex justify-center">
            <Button href={ctaHref} variant="gold" size="lg">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
