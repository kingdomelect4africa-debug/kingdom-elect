import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { SetNavTone } from '@/components/marketing/NavTone'

export const revalidate = 60

const STATUS_LABELS: Record<string, string> = {
  OPEN_FOR_APPLICATIONS: 'Applications Open',
  ONGOING: 'Ongoing',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
}

const PILLAR_LABELS: Record<string, string> = {
  EDUCATOR: 'Educators',
  LEADER: 'Leaders',
  ENTREPRENEUR: 'Entrepreneurs',
  CREATIVE: 'Creatives',
  TECHNOCRAT: 'Technocrats',
}

async function getProgram(slug: string) {
  return prisma.program.findUnique({
    where: { slug },
    include: { cohorts: true },
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgram(slug)
  if (!program) return {}
  return { title: program.seoTitle ?? program.title, description: program.seoDescription ?? program.summary }
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await getProgram(slug)
  if (!program) notFound()

  return (
    <>
      <SetNavTone tone="light" />

      <section className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <Container>
          <Kicker>{STATUS_LABELS[program.status] ?? program.status}</Kicker>
          <h1 className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            {program.title}
          </h1>
          <p className="mt-5 max-w-[560px] font-sans text-[1.05rem] leading-[1.8] text-body">{program.summary}</p>

          {program.pillarTags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {program.pillarTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[var(--radius-sm)] border border-line-strong px-3 py-[0.4rem] font-sans text-[0.72rem] uppercase text-body"
                  style={{ letterSpacing: '0.04em' }}
                >
                  {PILLAR_LABELS[tag] ?? tag}
                </span>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-ivory pb-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-serif text-2xl font-semibold text-ink">Overview</h2>
              <p className="mt-4 whitespace-pre-line font-sans leading-[1.8] text-body">{program.description}</p>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="rounded-[var(--radius-md)] border border-line p-[1.75rem]">
                <h2 className="font-serif text-xl font-semibold text-ink">
                  {program.status === 'OPEN_FOR_APPLICATIONS' ? 'Applications are open' : 'Interested?'}
                </h2>
                <p className="mt-3 font-sans text-sm text-body">
                  Applications are reviewed by the program team. Reach out to express interest.
                </p>
                <div className="mt-6">
                  <Button href={`/get-involved?program=${program.slug}`} variant="navy">
                    Apply / Enquire
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
