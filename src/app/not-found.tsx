import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Kicker } from '@/components/ui/Section'
import { NavToneProvider, SetNavTone } from '@/components/marketing/NavTone'
import { NetworkNodes } from '@/components/devices/NetworkNodes'

export default function NotFound() {
  return (
    // Not-found.tsx lives outside the (marketing) route group, so it needs
    // its own NavToneProvider — the marketing layout's doesn't wrap it.
    <NavToneProvider>
      <SetNavTone tone="dark" />
      <Header />
      <main>
        <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy-deep text-ivory">
          <NetworkNodes className="absolute inset-0 h-full w-full opacity-40" />
          <Container className="relative z-10 pt-32">
            <Kicker onDark>404</Kicker>
            <h1 className="mt-6 max-w-2xl font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ivory">
              This page has not been charted.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-[1.05rem] leading-[1.8] text-body-on-navy">
              The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved. Return to the homepage, or head into
              the Situation Room.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/" variant="gold">Return Home</Button>
              <Button href="/the-situation-room" variant="line-navy">Enter the Situation Room</Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </NavToneProvider>
  )
}
