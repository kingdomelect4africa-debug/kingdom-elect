import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'

export function Personality({ traits }: { traits: string[] }) {
  return (
    <section className="border-t border-border-subtle bg-surface py-24 md:py-32">
      <Container>
        <Eyebrow>The Experience</Eyebrow>
        <p className="mt-8 max-w-4xl font-serif text-3xl font-medium leading-[1.3] text-brand-primary md:text-4xl">
          {traits.map((trait, i) => (
            <span key={trait}>
              <span className={i % 3 === 1 ? 'text-brand-accent' : i % 3 === 2 ? 'text-brand-secondary' : undefined}>
                {trait}
              </span>
              {i < traits.length - 1 && <span className="text-ink-muted"> · </span>}
            </span>
          ))}
        </p>
      </Container>
    </section>
  )
}
