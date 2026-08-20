import { Container } from '@/components/ui/Container'

const LETTERS = [
  { letter: 'E', word: 'Educators' },
  { letter: 'L', word: 'Leaders' },
  { letter: 'E', word: 'Entrepreneurs' },
  { letter: 'C', word: 'Creatives' },
  { letter: 'T', word: 'Technocrats' },
]

export function StoryAcronym({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="border-y border-border-subtle bg-surface py-24 md:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-4xl font-medium leading-tight text-brand-primary md:text-5xl">{heading}</h2>
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted">{body}</p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex flex-wrap gap-x-2 gap-y-6 sm:gap-x-4">
              {LETTERS.map((item, i) => (
                <div key={i} className="flex flex-col items-start">
                  <span className="font-serif text-6xl font-medium text-brand-accent md:text-7xl">{item.letter}</span>
                  <span className="mt-1 font-sans text-xs uppercase text-ink-muted" style={{ letterSpacing: '0.08em' }}>
                    {item.word}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
