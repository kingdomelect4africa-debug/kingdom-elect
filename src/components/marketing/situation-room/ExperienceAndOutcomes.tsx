import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/primitives'

export function ExperienceAndOutcomes({
  sessionTypes,
  outcomes,
}: {
  sessionTypes: string[]
  outcomes: string[]
}) {
  return (
    <section className="border-t border-line-navy bg-navy-deep py-[clamp(4rem,8vw,6.5rem)] text-ivory">
      <Container>
        <div className="grid gap-[clamp(3rem,6vw,5rem)] lg:grid-cols-2">
          <List kicker="The Experience" heading="Beyond the conventional conference." items={sessionTypes} numbered />
          <List kicker="Expected Outcomes" heading="What the chamber produces." items={outcomes} />
        </div>
      </Container>
    </section>
  )
}

function List({ kicker, heading, items, numbered }: { kicker: string; heading: string; items: string[]; numbered?: boolean }) {
  return (
    <div>
      <Reveal>
        <Kicker onDark>{kicker}</Kicker>
        <h2 className="mt-4 font-serif text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold text-ivory">{heading}</h2>
      </Reveal>
      <ol className="mt-7 flex flex-col">
        {items.map((item, i) => (
          <li key={item}>
            <Reveal
              delay={0.05 + i * 0.06}
              y={14}
              className="group flex gap-4 border-t border-line-navy py-[1rem] font-sans text-[0.98rem] text-body-on-navy transition-colors duration-300 hover:text-ivory"
            >
              <span className="w-[1.8rem] flex-none font-serif text-[0.82rem] text-gold-light transition-transform duration-500 ease-[var(--ease-signature)] group-hover:translate-x-1">
                {numbered ? String(i + 1).padStart(2, '0') : <span className="mt-[0.7em] block h-px w-3 bg-gold-light" aria-hidden="true" />}
              </span>
              {item}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  )
}
