import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { ProgramCard } from '@/components/marketing/ProgramCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Programs',
  description: 'Pathways for Kingdom-minded educators, leaders, entrepreneurs, creatives, and technocrats.',
}

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: 'desc' },
    select: { title: true, slug: true, summary: true, status: true },
  })

  return (
    <>
      <section className="bg-surface pb-16 pt-40 md:pt-48">
        <Container>
          <Eyebrow>Programs</Eyebrow>
          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
            Pathways for the called.
          </h1>
        </Container>
      </section>

      <section className="bg-surface pb-24 md:pb-32">
        <Container>
          {programs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program.slug} program={program} />
              ))}
            </div>
          ) : (
            <p className="border border-border-subtle p-10 text-center font-sans text-ink-muted">
              New programs are in development — check back soon.
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
