'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import type { InquiryStatus, Prisma } from '@prisma/client'

export async function updateInquiryStatus(inquiryId: string, formData: FormData) {
  const user = await requireUser(['COMMUNICATIONS_MANAGER'])

  const status = (formData.get('status') as string | null) as InquiryStatus

  const data: Prisma.InquiryUpdateInput = { status }
  // Record who actioned it whenever it moves off NEW; leave handledById alone
  // if it's being moved back to NEW rather than clearing the history.
  if (status !== 'NEW') {
    data.handledBy = { connect: { id: user.id } }
  }

  await prisma.inquiry.update({ where: { id: inquiryId }, data })

  revalidatePath('/admin/inquiries')
  revalidatePath(`/admin/inquiries/${inquiryId}`)
  redirect(`/admin/inquiries/${inquiryId}?saved=1`)
}
