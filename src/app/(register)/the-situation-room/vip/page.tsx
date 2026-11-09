import type { Metadata } from 'next'
import { VipRegistration } from '@/components/marketing/situation-room/tier/VipRegistration'
import { TIER_CONFIRMATION_MESSAGE } from '@/lib/situation-room-tiers'
import { getTierForm, tierPageFields } from '@/lib/tier-forms'

export const metadata: Metadata = {
  title: 'VIP Registration — The Situation Room',
  description: 'VIP registration for the Kingdom E.L.E.C.T. for Africa Situation Room, Abuja, December 26–29, 2026.',
  robots: { index: false },
}

// The questions are edited in the Form Builder, which revalidates this page on save.
export const revalidate = 60

export default async function SituationRoomVipPage() {
  const form = await getTierForm('VIP')
  return (
    <VipRegistration
      fields={tierPageFields(form)}
      confirmationMessage={form.confirmationMessage?.trim() || TIER_CONFIRMATION_MESSAGE}
    />
  )
}
