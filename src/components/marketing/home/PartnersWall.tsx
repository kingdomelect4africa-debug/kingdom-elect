import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import type { Organization } from '@prisma/client'

const TYPE_LABELS: Record<string, string> = {
  CHURCH_MINISTRY: 'Church & Ministry', CORPORATE: 'Corporate', NGO: 'NGO',
  GOVERNMENT: 'Government', MEDIA: 'Media', ACADEMIC: 'Academic',
}

export function PartnersWall({ partners }: { partners: Pick<Organization, 'name' | 'slug' | 'type'>[] }) {
  if (partners.length === 0) return null

  return (
    <section className="border-y border-border-subtle bg-surface py-20">
      <Container>
        <Eyebrow>Institutional Partners</Eyebrow>
        <div className="mt-10 grid grid-cols-1 gap-px border border-border-subtle sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <div key={partner.slug} className="flex flex-col justify-between border-border-subtle bg-surface p-6 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
              <p className="font-serif text-lg text-brand-primary">{partner.name}</p>
              <p className="mt-2 font-sans text-xs uppercase text-ink-muted" style={{ letterSpacing: '0.06em' }}>
                {TYPE_LABELS[partner.type] ?? partner.type}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
