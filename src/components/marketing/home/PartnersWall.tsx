import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import type { Organization } from '@prisma/client'

export function PartnersWall({ partners }: { partners: Pick<Organization, 'name' | 'slug' | 'type'>[] }) {
  if (partners.length === 0) return null

  return (
    <section className="py-[clamp(2.5rem,5vw,3.5rem)]">
      <Container>
        <Kicker>Institutional Partners</Kicker>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-[clamp(2rem,6vw,5rem)]">
          {partners.map((partner) => (
            <span key={partner.slug} className="font-serif text-[1.1rem] text-body opacity-75 transition-opacity hover:opacity-100">
              {partner.name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}
