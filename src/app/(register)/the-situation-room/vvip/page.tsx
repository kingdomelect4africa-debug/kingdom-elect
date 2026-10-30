import type { Metadata } from 'next'
import { VvipRegistration } from '@/components/marketing/situation-room/tier/VvipRegistration'

export const metadata: Metadata = {
  title: 'VVIP Registration — The Situation Room',
  description: 'VVIP registration for the Kingdom E.L.E.C.T. for Africa Situation Room, Abuja, December 26–29, 2026.',
  robots: { index: false },
}

export default function SituationRoomVvipPage() {
  return <VvipRegistration />
}
