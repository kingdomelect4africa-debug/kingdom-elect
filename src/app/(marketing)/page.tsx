import { prisma } from '@/lib/db'
import { SetNavTone } from '@/components/marketing/NavTone'
import { Hero } from '@/components/marketing/home/Hero'
import { DefiningMoment } from '@/components/marketing/home/DefiningMoment'
import { KingdomFramework } from '@/components/marketing/home/KingdomFramework'
import { FiveTeaser } from '@/components/marketing/home/FiveTeaser'
import { SituationRoomTeaser } from '@/components/marketing/home/SituationRoomTeaser'
import { IntelligenceTeaser } from '@/components/marketing/home/IntelligenceTeaser'
import { ProgramsEventsTeaser } from '@/components/marketing/home/ProgramsEventsTeaser'
import { PartnersWall } from '@/components/marketing/home/PartnersWall'
import { StoriesTeaser } from '@/components/marketing/home/StoriesTeaser'
import { ParticipationCta } from '@/components/marketing/home/ParticipationCta'
import type { PillarContent, PillarRelated } from '@/components/marketing/the-five/FiveExplorer'
import type { PillarTag } from '@prisma/client'

export const revalidate = 60

const PILLAR_KEYS: PillarTag[] = ['EDUCATOR', 'LEADER', 'ENTREPRENEUR', 'CREATIVE', 'TECHNOCRAT']

export default async function HomePage() {
  const [content, fiveContent, featuredEvent, upcomingEvents, featuredPrograms, featuredArticles, featuredPartners, featuredStories] =
    await Promise.all([
      prisma.homePageContent.findUnique({ where: { id: 1 } }),
      prisma.theFivePageContent.findUnique({ where: { id: 1 } }),
      prisma.event.findFirst({
        where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
        orderBy: { startDate: 'asc' },
        select: { title: true, slug: true, startDate: true, endDate: true, venueCity: true, venueCountry: true },
      }),
      prisma.event.findMany({
        where: { status: 'PUBLISHED', featuredOnHomepage: true, endDate: { gte: new Date() } },
        orderBy: { startDate: 'asc' },
        take: 3,
        select: {
          title: true, slug: true, type: true, summary: true, startDate: true, endDate: true,
          venueCity: true, venueCountry: true, isVirtual: true, registrationStatus: true,
        },
      }),
      prisma.program.findMany({
        where: { featuredOnHomepage: true },
        take: 3,
        select: { title: true, slug: true, summary: true, status: true },
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED', featuredOnHomepage: true },
        orderBy: { publishedDate: 'desc' },
        take: 3,
        select: { title: true, slug: true, subtitle: true, excerpt: true, category: true, publishedDate: true },
      }),
      prisma.organization.findMany({
        where: { featuredOnHomepage: true },
        take: 4,
        select: { name: true, slug: true, type: true },
      }),
      prisma.story.findMany({
        where: { status: 'PUBLISHED', featuredOnHomepage: true },
        take: 3,
        select: {
          slug: true, title: true, summary: true,
          personFeatured: { select: { firstName: true, lastName: true, title: true } },
        },
      }),
    ])

  if (!content) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="font-sans text-ink-muted">
          Homepage content has not been configured yet. Sign in to the admin to set it up.
        </p>
      </div>
    )
  }

  const momentStats = (content.momentStats as { value: string; label: string }[]) ?? []
  const frameworkSteps = (content.frameworkSteps as { label: string; description: string }[]) ?? []
  const pillars = (fiveContent?.pillars as PillarContent[] | undefined) ?? []

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
      <SetNavTone tone="dark" />
      <Hero
        eyebrow={content.heroEyebrow}
        heading={content.heroHeading}
        subheading={content.heroSubheading}
        primaryCtaLabel={content.heroPrimaryCtaLabel}
        primaryCtaHref={content.heroPrimaryCtaHref}
        secondaryCtaLabel={content.heroSecondaryCtaLabel}
        secondaryCtaHref={content.heroSecondaryCtaHref}
      />
      <DefiningMoment
        eyebrow={content.momentEyebrow}
        heading={content.momentHeading}
        body={content.momentBody}
        stats={momentStats}
      />
      <KingdomFramework heading={content.frameworkHeading} intro={content.frameworkIntro} steps={frameworkSteps} />
      <FiveTeaser heading={content.fiveHeading} intro={content.fiveIntro} pillars={pillars} related={related} />
      <SituationRoomTeaser heading={content.situationRoomHeading} body={content.situationRoomBody} event={featuredEvent} />
      <IntelligenceTeaser heading={content.intelligenceHeading} articles={featuredArticles} />
      <ProgramsEventsTeaser programs={featuredPrograms} events={upcomingEvents} />
      <PartnersWall partners={featuredPartners} />
      <StoriesTeaser stories={featuredStories} />
      <ParticipationCta
        heading={content.participationHeading}
        body={content.participationBody}
        ctaLabel={content.participationCtaLabel}
        ctaHref={content.participationCtaHref}
      />
    </>
  )
}
