import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'

export const revalidate = 60

const STATUS_LABELS: Record<string, string> = {
  OPEN_FOR_APPLICATIONS: 'Applications Open', ONGOING: 'Ongoing', CLOSED: 'Closed', ARCHIVED: 'Archived',
}

const PILLAR_LABELS: Record<string, string> = {
  EDUCATOR: 'Educators', LEADER: 'Leaders', ENTREPRENEUR: 'Entrepreneurs', CREATIVE: 'Creatives', TECHNOCRAT: 'Technocrats',
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
    <section className="bg-surface pb-24 pt-40 md:pb-32 md:pt-48">
      <Container>
        <Eyebrow>{STATUS_LABELS[program.status] ?? program.status}</Eyebrow>
        <h1 className="mt-6 max-w-3xl font-serif text-4xl font-medium leading-[1.1] tracking-tight text-brand-primary md:text-5xl">
          {program.title}
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-ink-muted">{program.summary}</p>

        {program.pillarTags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {program.pillarTags.map((tag) => (
              <span key={tag} className="border border-border-strong px-3 py-1.5 font-sans text-xs uppercase text-brand-primary" style={{ letterSpacing: '0.04em' }}>
                {PILLAR_LABELS[tag] ?? tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-14 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="whitespace-pre-line font-sans text-base leading-relaxed text-ink">{program.description}</p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border border-border-strong p-8">
              <h2 className="font-serif text-xl font-medium text-brand-primary">
                {program.status === 'OPEN_FOR_APPLICATIONS' ? 'Applications are open' : 'Interested?'}
              </h2>
              <p className="mt-3 font-sans text-sm text-ink-muted">
                Applications are reviewed by the program team. Reach out to express interest.
              </p>
              <div className="mt-6">
                <Button href={`/get-involved?program=${program.slug}`} variant="primary">
                  Apply / Enquire
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
