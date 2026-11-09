import { Container } from '@/components/ui/Container'
import { Reveal, SpotlightGroup } from '@/components/motion/primitives'

type FunctionItem = { title: string; body: string }

export function FunctionsGrid({ functions }: { functions: FunctionItem[] }) {
  return (
    <section className="bg-navy-deep pb-[clamp(4.5rem,9vw,8.5rem)] pt-[clamp(2rem,4vw,3rem)] text-ivory">
      <Container>
        <Reveal>
          <h2 className="font-serif text-[clamp(2rem,3.8vw,3rem)] font-semibold leading-[1.1] text-ivory">Four functions, one chamber.</h2>
        </Reveal>

        <SpotlightGroup className="mt-12 grid grid-cols-1 gap-px border border-line-navy bg-line-navy sm:grid-cols-2">
          {functions.map((fn, i) => (
            <Reveal
              key={fn.title}
              delay={(i % 2) * 0.1}
              y={20}
              className="spotlight group bg-navy p-[2.2rem] transition-colors duration-500 [--spot-color:rgba(227,185,78,0.14)] hover:bg-navy-mid"
            >
              <div className="flex items-center gap-3">
                <span className="font-serif text-[0.9rem] text-gold-light">{String(i + 1).padStart(2, '0')}</span>
                <span
                  className="h-px w-6 origin-left bg-gold-light/70 transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-x-[2.5]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-[0.9rem] font-serif text-[1.2rem] font-semibold text-ivory">{fn.title}</h3>
              <p className="mt-[0.6rem] font-sans text-[0.9rem] leading-[1.65] text-body-on-navy">{fn.body}</p>
            </Reveal>
          ))}
        </SpotlightGroup>
      </Container>
    </section>
  )
}
