import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'

export function ExperienceAndOutcomes({
  sessionTypes,
  outcomes,
}: {
  sessionTypes: string[]
  outcomes: string[]
}) {
  return (
    <section className="bg-brand-primary py-24 text-ink-inverse md:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Eyebrow>The Experience</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl font-medium leading-tight md:text-4xl">
              Beyond the conventional conference.
            </h2>
            <ol className="mt-10 divide-y divide-white/10 border-t border-white/10">
              {sessionTypes.map((type, i) => (
                <li key={type} className="flex items-baseline gap-4 py-4">
                  <span className="font-serif text-sm text-brand-accent">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-sans text-base text-ivory-500/90">{type}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <Eyebrow>Expected Outcomes</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl font-medium leading-tight md:text-4xl">
              What the chamber produces.
            </h2>
            <ul className="mt-10 divide-y divide-white/10 border-t border-white/10">
              {outcomes.map((outcome) => (
                <li key={outcome} className="py-4 font-sans text-base leading-relaxed text-ivory-500/90">
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
