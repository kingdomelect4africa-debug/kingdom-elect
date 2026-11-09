import type { Metadata } from 'next'
import { VvipRegistration } from '@/components/marketing/situation-room/tier/VvipRegistration'
import { TIER_CONFIRMATION_MESSAGE } from '@/lib/situation-room-tiers'
import { getTierForm, tierPageFields } from '@/lib/tier-forms'

export const metadata: Metadata = {
  title: 'VVIP Registration — The Situation Room',
  description: 'VVIP registration for the Kingdom E.L.E.C.T. for Africa Situation Room, Abuja, December 26–29, 2026.',
  robots: { index: false },
}

// The questions are edited in the Form Builder, which revalidates this page on save.
export const revalidate = 60

export default async function SituationRoomVvipPage() {
  const form = await getTierForm('VVIP')
  return (
    <VvipRegistration
      fields={tierPageFields(form)}
      confirmationMessage={form.confirmationMessage?.trim() || TIER_CONFIRMATION_MESSAGE}
    />
  )
}
