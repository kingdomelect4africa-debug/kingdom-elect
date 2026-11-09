import { Container } from '@/components/ui/Container'
import { LinkArrow } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/primitives'
import { FiveExplorer, type PillarContent, type PillarRelated } from '@/components/marketing/the-five/FiveExplorer'

export function FiveTeaser({
  heading,
  intro,
  pillars,
  related,
}: {
  heading: string
  intro: string
  pillars: PillarContent[]
  related: Record<string, PillarRelated>
}) {
  return (
    <section className="bg-ivory py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container>
        <Reveal className="max-w-[640px]">
          <h2 className="font-serif text-[clamp(2rem,3.8vw,3rem)] font-semibold leading-[1.1] text-ink">{heading}</h2>
          <p className="mt-5 font-sans leading-[1.85] text-body">{intro}</p>
        </Reveal>

        <Reveal className="mt-12" delay={0.1} amount={0.15}>
          <FiveExplorer pillars={pillars} related={related} />
        </Reveal>

        <div className="mt-6 text-right">
          <LinkArrow href="/the-five">Explore The Five in depth</LinkArrow>
        </div>
      </Container>
    </section>
  )
}
