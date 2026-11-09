import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { LinkArrow } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { SetNavTone } from '@/components/marketing/NavTone'
import { PageHero } from '@/components/marketing/PageHero'
import { FeatureVisual } from '@/components/marketing/FeatureVisual'
import { ProgramCard } from '@/components/marketing/ProgramCard'
import { Reveal } from '@/components/motion/primitives'

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
      <SetNavTone tone="dark" />
      <PageHero id="programs" eyebrow="Programs" title="Pathways for the called." motif="pillars" />

      <section className="bg-ivory py-[clamp(4rem,8vw,6.5rem)]">
        <Container>
          {featured ? (
            <>
              <Reveal className="group grid overflow-hidden rounded-[var(--radius-md)] border border-line bg-ivory shadow-[0_30px_70px_-45px_rgba(11,31,58,0.45)] md:grid-cols-[0.9fr_1.1fr]">
                <FeatureVisual id="programs-featured" motif="pillars" className="min-h-[240px] md:min-h-[360px]">
                  <span
                    className="absolute left-7 top-7 font-sans text-[0.68rem] font-bold uppercase text-gold-light"
                    style={{ letterSpacing: '0.12em' }}
                  >
                    {STATUS_LABELS[featured.status] ?? featured.status}
                  </span>
                </FeatureVisual>
                <div className="flex flex-col justify-center p-[clamp(2rem,4vw,3.25rem)]">
                  <span className="font-sans text-[0.68rem] font-bold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
                    Featured Program
                  </span>
                  <h2 className="mt-3 font-serif text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15] text-ink">{featured.title}</h2>
                  <p className="mt-4 max-w-[480px] font-sans leading-[1.8] text-body">{featured.summary}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Button href={`/programs/${featured.slug}`} variant="navy">
                      Explore the Program
                    </Button>
                    <LinkArrow href={`/get-involved?program=${featured.slug}`}>Apply / enquire</LinkArrow>
                  </div>
                </div>
              </Reveal>

              {rest.length > 0 && (
                <div className="mt-14 divide-y divide-line border-t border-line">
                  {rest.map((program, i) => (
                    <Reveal key={program.slug} delay={Math.min(i, 5) * 0.06} y={18}>
                      <ProgramCard program={program} />
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Reveal className="rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-[0.95rem] text-body">
              New programs are in development. Check back soon.
            </Reveal>
          )}
        </Container>
      </section>
    </>
  )
}
