'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { canViewReviewerNotes } from '@/lib/rbac'
import type { ApplicationStatus, Prisma } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

export async function updateApplicationStatus(applicationId: string, formData: FormData) {
  const user = await requireUser(['PROGRAM_MANAGER'])

  const data: Prisma.ApplicationUncheckedUpdateInput = {
    status: str(formData, 'status') as ApplicationStatus,
    reviewedById: user.id,
  }

  // Reviewer notes are sensitive to program review — only persist a change to
  // them if the acting user is actually allowed to see/edit that field.
  if (canViewReviewerNotes(user)) {
    data.reviewerNotes = str(formData, 'reviewerNotes') || null
  }

  await prisma.application.update({ where: { id: applicationId }, data })

  revalidatePath('/admin/applications')
  revalidatePath(`/admin/applications/${applicationId}`)
  redirect(`/admin/applications/${applicationId}?saved=1`)
}
