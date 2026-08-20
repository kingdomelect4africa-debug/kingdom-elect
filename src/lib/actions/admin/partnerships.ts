'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import type { PartnershipStatus, PartnershipType } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function partnershipPayload(formData: FormData) {
  return {
    organizationId: str(formData, 'organizationId'),
    type: str(formData, 'type') as PartnershipType,
    relatedProgramId: str(formData, 'relatedProgramId') || null,
    relatedEventId: str(formData, 'relatedEventId') || null,
    relatedChapterId: str(formData, 'relatedChapterId') || null,
    startDate: str(formData, 'startDate') ? new Date(str(formData, 'startDate')) : null,
    endDate: str(formData, 'endDate') ? new Date(str(formData, 'endDate')) : null,
    status: str(formData, 'status') as PartnershipStatus,
    // `value` is financial data — only ever present in the submitted form for
    // users canViewFinancialValue() allowed (see PartnershipForm), and only
    // FINANCE_ADMINISTRATOR / SUPER_ADMIN can even reach this action.
    value: str(formData, 'value') || null,
    primaryContactId: str(formData, 'primaryContactId') || null,
  }
}

export async function createPartnership(formData: FormData) {
  await requireUser(['FINANCE_ADMINISTRATOR'])
  const partnership = await prisma.partnership.create({ data: partnershipPayload(formData) })
  revalidatePath('/partners')
  revalidatePath('/admin/partnerships')
  redirect(`/admin/partnerships/${partnership.id}?saved=1`)
}

export async function updatePartnership(partnershipId: string, formData: FormData) {
  await requireUser(['FINANCE_ADMINISTRATOR'])
  await prisma.partnership.update({ where: { id: partnershipId }, data: partnershipPayload(formData) })
  revalidatePath('/partners')
  revalidatePath('/admin/partnerships')
  revalidatePath(`/admin/partnerships/${partnershipId}`)
  redirect(`/admin/partnerships/${partnershipId}?saved=1`)
}

export async function deletePartnership(partnershipId: string) {
  await requireUser(['FINANCE_ADMINISTRATOR'])
  await prisma.partnership.delete({ where: { id: partnershipId } })
  revalidatePath('/partners')
  revalidatePath('/admin/partnerships')
  redirect('/admin/partnerships?deleted=1')
}
