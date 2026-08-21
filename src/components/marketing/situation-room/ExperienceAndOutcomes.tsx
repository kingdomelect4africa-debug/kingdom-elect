import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'

export function ExperienceAndOutcomes({
  sessionTypes,
  outcomes,
}: {
  sessionTypes: string[]
  outcomes: string[]
}) {
  return (
    <section className="bg-navy-deep py-[clamp(3rem,6vw,5rem)] text-ivory">
      <Container>
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-2">
          <div>
            <Kicker onDark>The Experience</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-semibold text-ivory">
              Beyond the conventional conference.
            </h2>
            <ol className="mt-6 flex flex-col">
              {sessionTypes.map((type, i) => (
                <li
                  key={type}
                  className="flex gap-4 border-t border-line-navy py-[0.9rem] font-sans text-[0.95rem] text-body-on-navy first:border-t-0"
                >
                  <span className="w-[1.6rem] flex-none font-serif text-[0.8rem] text-gold-light">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {type}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <Kicker onDark>Expected Outcomes</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-semibold text-ivory">
              What the chamber produces.
            </h2>
            <ol className="mt-6 flex flex-col">
              {outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex gap-4 border-t border-line-navy py-[0.9rem] font-sans text-[0.95rem] text-body-on-navy first:border-t-0"
                >
                  <span className="w-[1.6rem] flex-none font-serif text-[0.8rem] text-gold-light">·</span>
                  {outcome}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}
