import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
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
        <p className="font-sans text-ink-muted">The Five content has not been configured yet.</p>
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
      <section className="bg-surface pb-16 pt-40 md:pt-48">
        <Container>
          <Eyebrow>Collective Influence</Eyebrow>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
            {content.heading}
          </h1>
          <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{content.intro}</p>
        </Container>
      </section>

      <section className="bg-surface pb-24 md:pb-32">
        <Container>
          <FiveExplorer pillars={pillars} related={related} />
        </Container>
      </section>
    </>
  )
}
