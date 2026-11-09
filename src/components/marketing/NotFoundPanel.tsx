import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Kicker } from '@/components/ui/Section'
import { DrawnNetwork } from '@/components/devices/DrawnNetwork'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { Reveal, SplitWords } from '@/components/motion/primitives'

/** The body of the 404 page, shared by the site-wide and public-pages versions. */
export function NotFoundPanel() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-navy-deep text-ivory">
      <DrawnNetwork className="absolute inset-0 -z-10 h-full w-full opacity-50 [mask-image:linear-gradient(90deg,transparent_25%,black_70%)]" />
      <div
        className="absolute inset-0 -z-10 text-ivory opacity-[0.05] [mask-image:radial-gradient(ellipse_60%_70%_at_25%_50%,black,transparent_75%)]"
        aria-hidden="true"
      >
        <KingdomGrid id="not-found-grid" className="h-full w-full" />
      </div>
      <Container className="relative py-24">
        <Reveal y={12}>
          <Kicker onDark>404</Kicker>
        </Reveal>
        <h1 className="mt-6 max-w-2xl font-serif text-[clamp(2.3rem,5vw,3.8rem)] font-semibold leading-[1.1] text-ivory">
          <SplitWords text="This page has not been charted." delay={0.1} />
        </h1>
        <Reveal delay={0.4} y={16}>
          <p className="mt-6 max-w-xl font-sans text-[1.05rem] leading-[1.8] text-body-on-navy">
            The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved. Return to the homepage, or head into the
            Situation Room.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/" variant="gold">
              Return Home
            </Button>
            <Button href="/the-situation-room" variant="line-navy">
              Enter the Situation Room
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
