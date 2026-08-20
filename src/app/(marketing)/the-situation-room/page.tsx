import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { SituationRoomHero } from '@/components/marketing/situation-room/SituationRoomHero'
import { FunctionsGrid } from '@/components/marketing/situation-room/FunctionsGrid'
import { ExperienceAndOutcomes } from '@/components/marketing/situation-room/ExperienceAndOutcomes'
import { RegistrationPanel } from '@/components/marketing/situation-room/RegistrationPanel'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'The Situation Room',
  description: 'A governance chamber for Kingdom intelligence and strategic action.',
}

export default async function SituationRoomPage() {
  const content = await prisma.situationRoomPageContent.findUnique({ where: { id: 1 } })

  if (!content) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="font-sans text-ink-muted">The Situation Room content has not been configured yet.</p>
      </div>
    )
  }

  const featuredEvent = content.featuredEventId
    ? await prisma.event.findUnique({
        where: { id: content.featuredEventId },
        select: {
          slug: true, title: true, startDate: true, endDate: true, venueName: true,
          venueCity: true, venueCountry: true, isVirtual: true, capacity: true, registrationStatus: true,
        },
      })
    : null

  const functions = (content.functions as { title: string; body: string }[]) ?? []
  const sessionTypes = (content.sessionTypes as string[]) ?? []
  const outcomes = (content.outcomes as string[]) ?? []

  return (
    <>
      <SituationRoomHero
        heading={content.heroHeading}
        subheading={content.heroSubheading}
        philosophy={content.philosophyStatement}
      />
      <FunctionsGrid functions={functions} />
      <ExperienceAndOutcomes sessionTypes={sessionTypes} outcomes={outcomes} />
      <RegistrationPanel event={featuredEvent} />
    </>
  )
}
