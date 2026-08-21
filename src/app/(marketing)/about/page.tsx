import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { SetNavTone } from '@/components/marketing/NavTone'
import { AboutHero } from '@/components/marketing/about/AboutHero'
import { StoryAcronym } from '@/components/marketing/about/StoryAcronym'
import { Statements } from '@/components/marketing/about/Statements'
import { Objectives } from '@/components/marketing/about/Objectives'
import { Personality } from '@/components/marketing/about/Personality'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About',
  description: "The purpose, vision, and mission of Kingdom E.L.E.C.T. for Africa.",
}

export default async function AboutPage() {
  const content = await prisma.aboutPageContent.findUnique({ where: { id: 1 } })

  if (!content) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="font-sans text-ink-muted">About page content has not been configured yet.</p>
      </div>
    )
  }

  const objectives = (content.objectives as { title: string; body: string }[]) ?? []
  const personality = (content.personality as { trait: string }[]) ?? []

  return (
    <>
      <SetNavTone tone="light" />
      <AboutHero heading={content.heroHeading} body={content.heroBody} />
      <StoryAcronym heading={content.storyHeading} body={content.storyBody} />
      <Statements
        vision={content.visionStatement}
        mission={content.missionStatement}
        purpose={content.purposeStatement}
        essence={content.essenceStatement}
      />
      <Objectives objectives={objectives} />
      <Personality traits={personality.map((p) => p.trait)} />
    </>
  )
}
