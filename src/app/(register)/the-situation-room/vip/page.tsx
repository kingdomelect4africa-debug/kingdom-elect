import type { Metadata } from 'next'
import { VipRegistration } from '@/components/marketing/situation-room/tier/VipRegistration'

export const metadata: Metadata = {
  title: 'VIP Registration — The Situation Room',
  description: 'VIP registration for the Kingdom E.L.E.C.T. for Africa Situation Room, Abuja, December 26–29, 2026.',
  robots: { index: false },
}

export default function SituationRoomVipPage() {
  return <VipRegistration />
}
