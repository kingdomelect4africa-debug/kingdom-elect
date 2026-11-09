import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal, SplitWords } from '@/components/motion/primitives'
import { LogoMark } from '@/components/marketing/LogoMark'
import { DrawnNetwork } from '@/components/devices/DrawnNetwork'

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
    <section className="relative isolate overflow-hidden bg-navy-deep py-[clamp(5rem,10vw,8.5rem)] text-center text-ivory">
      <DrawnNetwork className="absolute inset-0 -z-10 h-full w-full opacity-60" />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(50% 60% at 50% 38%, rgba(201,146,24,0.16), transparent 70%)' }}
        aria-hidden="true"
      />

      <Container className="relative">
        {/* The mark radiates outward (logo animation: "Radiate"). */}
        <Reveal className="relative mx-auto grid h-24 w-24 place-items-center" y={16}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full border border-gold/50 motion-reduce:hidden"
              style={{ animation: `radiate 4.8s ease-out ${i * 1.6}s infinite` }}
              aria-hidden="true"
            />
          ))}
          <span className="relative grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-ivory shadow-[0_0_40px_rgba(227,185,78,0.25)]">
            <LogoMark className="h-10" />
          </span>
        </Reveal>

        <h2 className="mx-auto mt-9 max-w-[780px] font-serif text-[clamp(2.1rem,4.4vw,3.5rem)] font-semibold leading-[1.1] text-ivory">
          <SplitWords text={heading} inView />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-[540px] font-sans leading-[1.8] text-body-on-navy">{body}</p>
          <div className="mt-9 flex justify-center">
            <Button href={ctaHref} variant="gold">
              {ctaLabel}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
