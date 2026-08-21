import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker, LinkArrow } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { SetNavTone } from '@/components/marketing/NavTone'
import { ProgramCard } from '@/components/marketing/ProgramCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Programs',
  description: 'Pathways for Kingdom-minded educators, leaders, entrepreneurs, creatives, and technocrats.',
}

const STATUS_LABELS: Record<string, string> = {
  OPEN_FOR_APPLICATIONS: 'Applications Open',
  ONGOING: 'Ongoing',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
}

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: 'desc' },
    select: { title: true, slug: true, summary: true, status: true },
  })

  const [featured, ...rest] = programs

  return (
    <>
      <SetNavTone tone="light" />

      <section className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <Container>
          <Kicker>Programs</Kicker>
          <h1 className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            Pathways for the called.
          </h1>
        </Container>
      </section>

      <section className="bg-ivory pt-4 pb-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          {featured ? (
            <>
              <div className="rounded-[var(--radius-md)] border border-line-strong p-[clamp(2rem,4vw,3rem)] text-center">
                <span
                  className="mb-[0.8rem] inline-block font-sans text-[0.68rem] font-bold uppercase text-emerald"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {STATUS_LABELS[featured.status] ?? featured.status}
                </span>
                <h3 className="font-serif text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold text-ink">{featured.title}</h3>
                <p className="mx-auto mt-4 max-w-[480px] font-sans leading-[1.8] text-body">{featured.summary}</p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-6">
                  <Button href={`/programs/${featured.slug}`} variant="navy">
                    Explore the Program
                  </Button>
                  <LinkArrow href={`/get-involved?program=${featured.slug}`}>Apply / enquire</LinkArrow>
                </div>
              </div>

              {rest.length > 0 && (
                <div className="mt-10 divide-y divide-line border-t border-line">
                  {rest.map((program) => (
                    <ProgramCard key={program.slug} program={program} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-[0.95rem] text-body">
              New programs are in development — check back soon.
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
