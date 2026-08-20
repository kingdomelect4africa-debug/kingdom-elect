import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Partners',
  description: 'Institutional partners collaborating with Kingdom E.L.E.C.T. for Africa.',
}

const TYPE_LABELS: Record<string, string> = {
  CHURCH_MINISTRY: 'Church & Ministry', CORPORATE: 'Corporate', NGO: 'NGO',
  GOVERNMENT: 'Government', MEDIA: 'Media', ACADEMIC: 'Academic',
}

export default async function PartnersPage() {
  const partners = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, slug: true, type: true, description: true, website: true, country: true },
  })

  return (
    <>
      <section className="bg-surface pb-16 pt-40 md:pt-48">
        <Container>
          <Eyebrow>Institutional Partners</Eyebrow>
          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
            Coalition, not just contribution.
          </h1>
        </Container>
      </section>

      <section className="bg-surface pb-24 md:pb-32">
        <Container>
          {partners.length > 0 ? (
            <div className="divide-y divide-border-subtle border-t border-border-subtle">
              {partners.map((partner) => (
                <div key={partner.slug} className="flex flex-col gap-4 py-8 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase text-brand-secondary" style={{ letterSpacing: 'var(--tracking-label)' }}>
                      {TYPE_LABELS[partner.type] ?? partner.type} {partner.country ? `· ${partner.country}` : ''}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-medium text-brand-primary">{partner.name}</h3>
                    {partner.description && <p className="mt-2 max-w-2xl font-sans text-sm text-ink-muted">{partner.description}</p>}
                  </div>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="shrink-0 font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline"
                      style={{ letterSpacing: 'var(--tracking-label)' }}
                    >
                      Visit site →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="border border-border-subtle p-10 text-center font-sans text-ink-muted">
              Institutional partners will be listed here.
            </p>
          )}

          <div className="mt-16 border border-border-strong p-10 text-center">
            <h2 className="font-serif text-2xl text-brand-primary">Become an Institutional Partner</h2>
            <p className="mx-auto mt-3 max-w-xl font-sans text-sm text-ink-muted">
              Partner with Kingdom E.L.E.C.T. for Africa on programs, events, and territorial development initiatives.
            </p>
            <div className="mt-6">
              <Button href="/get-involved?interest=institutional-partner" variant="primary">
                Start a Partnership Conversation
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
