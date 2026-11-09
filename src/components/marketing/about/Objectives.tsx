import { Container } from '@/components/ui/Container'
import { Reveal, SpotlightGroup } from '@/components/motion/primitives'

type Objective = { title: string; body: string }

export function Objectives({ objectives }: { objectives: Objective[] }) {
  return (
    <section className="bg-ivory py-[clamp(4.5rem,9vw,8.5rem)]">
      <Container>
        <Reveal className="max-w-[600px]">
          <h2 className="font-serif text-[clamp(2rem,3.8vw,3rem)] font-semibold leading-[1.1] text-ink">Six commitments, one mandate.</h2>
        </Reveal>

        <SpotlightGroup className="mt-12 grid grid-cols-1 gap-px border border-line bg-line lg:grid-cols-2">
          {objectives.map((objective, i) => (
            <Reveal key={objective.title} delay={(i % 2) * 0.1} y={20} className="spotlight group bg-ivory px-[2.2rem] py-9">
              <div className="flex items-center gap-3">
                <span className="font-serif text-[0.95rem] font-semibold text-gold-dark">{String(i + 1).padStart(2, '0')}</span>
                <span
                  className="h-px w-6 origin-left bg-gold transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-x-[2.5]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-[0.9rem] font-serif text-[1.12rem] font-semibold leading-snug text-ink">{objective.title}</h3>
              <p className="mt-[0.55rem] font-sans text-[0.9rem] leading-[1.65] text-body">{objective.body}</p>
            </Reveal>
          ))}
        </SpotlightGroup>
      </Container>
    </section>
  )
}
