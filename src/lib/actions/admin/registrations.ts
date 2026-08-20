'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import type { RegistrationStatus } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function withSavedFlag(path: string, flag: string): string {
  return path.includes('?') ? `${path}&${flag}` : `${path}?${flag}`
}

/** Used by the Registrations list — a per-row status select that posts back here. */
export async function updateRegistrationStatus(registrationId: string, formData: FormData) {
  const user = await requireUser(['EVENTS_MANAGER'])
  const status = str(formData, 'status') as RegistrationStatus
  const redirectTo = str(formData, 'redirectTo') || '/admin/registrations'

  await prisma.registration.update({
    where: { id: registrationId },
    data: {
      status,
      ...(status === 'CHECKED_IN' ? { checkedInAt: new Date(), checkedInById: user.id } : {}),
    },
  })

  revalidatePath('/admin/registrations')
  redirect(withSavedFlag(redirectTo, 'saved=1'))
}

/** Used by the door Check-In screen — one tap, no status picker. */
export async function checkInRegistration(registrationId: string, formData: FormData) {
  const user = await requireUser(['CHECK_IN_STAFF', 'EVENTS_MANAGER'])
  const redirectTo = str(formData, 'redirectTo') || '/admin/checkin'

  await prisma.registration.update({
    where: { id: registrationId },
    data: { status: 'CHECKED_IN', checkedInAt: new Date(), checkedInById: user.id },
  })

  revalidatePath('/admin/checkin')
  revalidatePath('/admin/registrations')
  redirect(withSavedFlag(redirectTo, 'checked=1'))
}
