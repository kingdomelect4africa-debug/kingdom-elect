import { Container } from '@/components/ui/Container'
import { Kicker, LinkArrow } from '@/components/ui/Section'
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
        <div className="max-w-[640px]">
          <Kicker>Collective Influence</Kicker>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ink">{heading}</h2>
          <p className="mt-4 font-sans leading-[1.85] text-body">{intro}</p>
        </div>

        <div className="mt-10">
          <FiveExplorer pillars={pillars} related={related} />
        </div>

        <div className="mt-5 text-right">
          <LinkArrow href="/the-five">Explore The Five in depth</LinkArrow>
        </div>
      </Container>
    </section>
  )
}
