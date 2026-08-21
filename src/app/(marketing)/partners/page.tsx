import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'
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
      <SetNavTone tone="light" />

      <section className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <Container>
          <Kicker>Institutional Partners</Kicker>
          <h1 className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            Coalition, not just contribution.
          </h1>
        </Container>
      </section>

      <section className="bg-ivory pb-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          {partners.length > 0 ? (
            <div className="border-t border-line">
              {partners.map((partner) => (
                <div
                  key={partner.slug}
                  className="flex flex-col gap-4 border-b border-line py-8 md:flex-row md:items-start md:justify-between"
                >
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
                      {TYPE_LABELS[partner.type] ?? partner.type} {partner.country ? `· ${partner.country}` : ''}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">{partner.name}</h3>
                    {partner.description && (
                      <p className="mt-2 max-w-2xl font-sans text-sm text-body">{partner.description}</p>
                    )}
                  </div>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex shrink-0 items-center gap-2 font-sans text-[0.85rem] font-semibold text-gold-dark"
                    >
                      Visit site
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-[15px] w-[15px] transition-transform duration-400 ease-[var(--ease-signature)] group-hover:translate-x-1"
                      >
                        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="border border-line p-10 text-center font-sans text-body">
              Institutional partners will be listed here.
            </p>
          )}

          <div className="mt-16 border border-line-strong p-10 text-center">
            <h2 className="font-serif text-2xl font-semibold text-ink">Become an Institutional Partner</h2>
            <p className="mx-auto mt-3 max-w-xl font-sans text-sm text-body">
              Partner with Kingdom E.L.E.C.T. for Africa on programs, events, and territorial development initiatives.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/get-involved?interest=institutional-partner" variant="gold">
                Start a Partnership Conversation
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
