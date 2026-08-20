import { Container } from '@/components/ui/Container'

export function Statements({
  vision,
  mission,
  purpose,
  essence,
}: {
  vision: string
  mission: string
  purpose: string
  essence: string
}) {
  const rows = [
    { label: 'Vision', text: vision },
    { label: 'Mission', text: mission },
    { label: 'Purpose', text: purpose },
    { label: 'Essence', text: essence },
  ]

  return (
    <section className="bg-brand-primary py-24 text-ink-inverse md:py-32">
      <Container>
        <div className="divide-y divide-white/10 border-t border-white/10">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-6 py-12 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-3">
                <p className="font-sans text-xs font-semibold uppercase text-brand-accent" style={{ letterSpacing: 'var(--tracking-label)' }}>
                  {row.label}
                </p>
              </div>
              <p className="font-serif text-2xl font-medium leading-snug md:col-span-9 md:text-3xl">{row.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
