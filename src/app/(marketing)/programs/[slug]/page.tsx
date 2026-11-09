import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { SetNavTone } from '@/components/marketing/NavTone'
import { PageHero } from '@/components/marketing/PageHero'
import { Reveal } from '@/components/motion/primitives'
import { ApplicationForm } from '@/components/marketing/forms/ApplicationForm'
import type { FormFieldConfig } from '@/lib/forms'

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
    include: { cohorts: true, applicationForm: true },
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

  const applicationFields =
    program.status === 'OPEN_FOR_APPLICATIONS' && program.applicationForm
      ? ((program.applicationForm.fields as unknown as FormFieldConfig[]) ?? [])
      : []

  return (
    <>
      <SetNavTone tone="dark" />
      <PageHero id="program" eyebrow={STATUS_LABELS[program.status] ?? program.status} title={program.title} intro={program.summary} motif="pillars">
        {program.pillarTags.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-2">
            {program.pillarTags.map((tag) => (
              <span
                key={tag}
                className="rounded-[var(--radius-sm)] border border-line-navy-strong px-3 py-[0.4rem] font-sans text-[0.72rem] uppercase text-body-on-navy"
                style={{ letterSpacing: '0.04em' }}
              >
                {PILLAR_LABELS[tag] ?? tag}
              </span>
            ))}
          </div>
        )}
      </PageHero>

      <section className="bg-ivory py-[clamp(4rem,8vw,6.5rem)]">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <h2 className="font-serif text-2xl font-semibold text-ink">Overview</h2>
              <p className="mt-4 whitespace-pre-line font-sans leading-[1.8] text-body">{program.description}</p>
            </Reveal>

            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={0.1} amount={0.02} className="rounded-[var(--radius-md)] border border-line bg-ivory p-[1.75rem] shadow-[0_30px_70px_-45px_rgba(11,31,58,0.45)] lg:sticky lg:top-28">
                {applicationFields.length > 0 ? (
                  <>
                    <h2 className="font-serif text-xl font-semibold text-ink">Apply</h2>
                    <p className="mt-3 font-sans text-sm text-body">Applications are reviewed by the program team.</p>
                    <div className="mt-6">
                      <ApplicationForm programSlug={program.slug} fields={applicationFields} />
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
