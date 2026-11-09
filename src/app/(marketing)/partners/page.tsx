import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { SetNavTone } from '@/components/marketing/NavTone'
import { PageHero } from '@/components/marketing/PageHero'
import { Button } from '@/components/ui/Button'
import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { Reveal, SplitWords } from '@/components/motion/primitives'

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
      <SetNavTone tone="dark" />
      <PageHero id="partners" eyebrow="Institutional Partners" title="Coalition, not just contribution." motif="network" />

      <section className="bg-ivory py-[clamp(4rem,8vw,6.5rem)]">
        <Container>
          {partners.length > 0 ? (
            <div className="border-t border-line">
              {partners.map((partner, i) => (
                <Reveal
                  key={partner.slug}
                  delay={Math.min(i, 5) * 0.06}
                  y={18}
                  className="group relative flex flex-col gap-4 border-b border-line py-8 transition-[padding] duration-500 ease-[var(--ease-signature)] hover:pl-5 md:flex-row md:items-start md:justify-between"
                >
                  <span
                    className="absolute bottom-8 left-0 top-8 w-[2px] origin-top scale-y-0 bg-gold transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-y-100"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
                      {TYPE_LABELS[partner.type] ?? partner.type} {partner.country ? `· ${partner.country}` : ''}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">{partner.name}</h3>
                    {partner.description && <p className="mt-2 max-w-2xl font-sans text-sm text-body">{partner.description}</p>}
                  </div>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group/link inline-flex shrink-0 items-center gap-2 font-sans text-[0.85rem] font-semibold text-gold-dark"
                    >
                      Visit site
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-[15px] w-[15px] transition-transform duration-400 ease-[var(--ease-signature)] group-hover/link:translate-x-1"
                      >
                        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="rounded-[var(--radius-md)] border border-dashed border-line-strong p-10 text-center font-sans text-body">
              Institutional partners will be listed here.
            </Reveal>
          )}

          <Reveal className="relative isolate mt-16 overflow-hidden rounded-[var(--radius-md)] bg-navy px-[clamp(1.75rem,5vw,4rem)] py-[clamp(3rem,6vw,4.5rem)] text-center text-ivory">
            <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(60% 80% at 50% 120%, rgba(201,146,24,0.28), transparent 70%)' }} aria-hidden="true" />
            <div className="absolute inset-0 -z-10 text-ivory opacity-[0.06]" aria-hidden="true">
              <KingdomGrid id="partners-cta-grid" className="h-full w-full" />
            </div>
            <h2 className="font-serif text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold text-ivory">
              <SplitWords text="Become an Institutional Partner" inView />
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-[0.95rem] leading-[1.7] text-body-on-navy">
              Partner with Kingdom E.L.E.C.T. for Africa on programs, events, and territorial development initiatives.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/get-involved?interest=institutional-partner" variant="gold">
                Start a Partnership Conversation
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
