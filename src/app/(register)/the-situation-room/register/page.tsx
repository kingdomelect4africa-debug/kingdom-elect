import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { RegistrationWizard } from '@/components/marketing/situation-room/register/RegistrationWizard'

export const metadata: Metadata = {
  title: 'Register — The Situation Room',
  description: 'Register your interest for the Kingdom E.L.E.C.T. for Africa Situation Room, Abuja, December 26–29, 2026.',
  robots: { index: false },
}

export default async function SituationRoomRegisterPage() {
  const event = await prisma.event.findUnique({
    where: { slug: 'the-situation-room-2026' },
    select: { capacity: true },
  })

  return <RegistrationWizard eventCapacity={event?.capacity ?? null} />
}
