import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'
import { FiveExplorer, type PillarContent, type PillarRelated } from '@/components/marketing/the-five/FiveExplorer'
import type { PillarTag } from '@prisma/client'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'The Five',
  description: 'Educators, Leaders, Entrepreneurs, Creatives, and Technocrats — the five strategic influence systems Kingdom E.L.E.C.T. convenes.',
}

const PILLAR_KEYS: PillarTag[] = ['EDUCATOR', 'LEADER', 'ENTREPRENEUR', 'CREATIVE', 'TECHNOCRAT']

export default async function TheFivePage() {
  const content = await prisma.theFivePageContent.findUnique({ where: { id: 1 } })

  if (!content) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="font-sans text-body">The Five content has not been configured yet.</p>
      </div>
    )
  }

  const pillars = (content.pillars as PillarContent[]) ?? []

  const relatedEntries = await Promise.all(
    PILLAR_KEYS.map(async (key) => {
      const [programs, articles, stories] = await Promise.all([
        prisma.program.findMany({ where: { pillarTags: { has: key } }, take: 3, select: { title: true, slug: true } }),
        prisma.article.findMany({
          where: { pillarTags: { has: key }, status: 'PUBLISHED' },
          take: 3,
          select: { title: true, slug: true },
        }),
        prisma.story.findMany({
          where: { status: 'PUBLISHED', personFeatured: { pillarTags: { has: key } } },
          take: 3,
          select: { title: true, slug: true },
        }),
      ])
      return [key, { programs, articles, stories }] as const
    }),
  )

  const related = Object.fromEntries(relatedEntries) as Record<string, PillarRelated>

  return (
    <>
      <SetNavTone tone="light" />
      <section className="bg-ivory pb-4 pt-[clamp(3.5rem,8vw,5.5rem)]">
        <Container>
          <Kicker>Collective Influence</Kicker>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            {content.heading}
          </h1>
          <p className="mt-5 max-w-[560px] font-sans text-[1.05rem] leading-[1.8] text-body">{content.intro}</p>
        </Container>
      </section>

      <section className="bg-ivory py-[clamp(4.5rem,9vw,8.5rem)] pt-4">
        <Container>
          <FiveExplorer pillars={pillars} related={related} />
        </Container>
      </section>
    </>
  )
}
