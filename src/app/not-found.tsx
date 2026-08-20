import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { RadiatingLines } from '@/components/devices/RadiatingLines'

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-brand-primary text-ink-inverse">
          <RadiatingLines className="absolute -right-32 -top-32 h-[480px] w-[480px] text-white" lines={22} />
          <Container className="relative z-10 pt-32">
            <p className="font-sans text-xs font-semibold uppercase text-brand-accent" style={{ letterSpacing: 'var(--tracking-label)' }}>
              404
            </p>
            <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
              This page has not been charted.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-ivory-500/85">
              The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved. Return to the homepage, or head into
              the Situation Room.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/" variant="gold" size="lg">Return Home</Button>
              <Button href="/the-situation-room" variant="ghost" size="lg">Enter the Situation Room</Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
