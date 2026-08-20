import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { RisingForms } from '@/components/devices/RisingForms'

export function AboutHero({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="relative overflow-hidden bg-surface pb-20 pt-40 md:pb-28 md:pt-48">
      <RisingForms className="absolute -right-10 top-24 h-64 w-64 text-navy-100" count={5} />
      <Container>
        <Eyebrow>About Kingdom E.L.E.C.T.</Eyebrow>
        <h1 className="mt-6 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
          {heading}
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{body}</p>
      </Container>
    </section>
  )
}
