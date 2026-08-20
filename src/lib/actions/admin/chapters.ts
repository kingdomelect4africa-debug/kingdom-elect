'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { slugify } from '@/lib/format'
import { assertChapterAccess } from '@/lib/rbac'
import type { ChapterStatus } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function chapterPayload(formData: FormData) {
  return {
    country: str(formData, 'country'),
    name: str(formData, 'name'),
    slug: slugify(str(formData, 'slug') || str(formData, 'name')),
    leadPersonId: str(formData, 'leadPersonId') || null,
    description: str(formData, 'description') || null,
    contactEmail: str(formData, 'contactEmail') || null,
    launchDate: str(formData, 'launchDate') ? new Date(str(formData, 'launchDate')) : null,
    status: str(formData, 'status') as ChapterStatus,
    seoTitle: str(formData, 'seoTitle') || null,
    seoDescription: str(formData, 'seoDescription') || null,
  }
}

// Opening a new chapter is a structural, continental-expansion decision —
// not something a chapter's own administrator can do.
export async function createChapter(formData: FormData) {
  await requireUser(['SUPER_ADMIN'])
  const chapter = await prisma.chapter.create({ data: chapterPayload(formData) })
  revalidatePath('/chapters')
  revalidatePath('/admin/chapters')
  redirect(`/admin/chapters/${chapter.id}?saved=1`)
}

export async function updateChapter(chapterId: string, formData: FormData) {
  const user = await requireUser(['CHAPTER_ADMINISTRATOR'])
  assertChapterAccess(user, chapterId)

  const existing = await prisma.chapter.findUniqueOrThrow({ where: { id: chapterId } })
  await prisma.chapter.update({ where: { id: chapterId }, data: chapterPayload(formData) })
  revalidatePath('/chapters')
  revalidatePath(`/chapters/${existing.slug}`)
  revalidatePath('/admin/chapters')
  revalidatePath(`/admin/chapters/${chapterId}`)
  redirect(`/admin/chapters/${chapterId}?saved=1`)
}

// Closing/removing a chapter, like opening one, is reserved for Super Admins.
export async function deleteChapter(chapterId: string) {
  await requireUser(['SUPER_ADMIN'])
  await prisma.chapter.delete({ where: { id: chapterId } })
  revalidatePath('/chapters')
  revalidatePath('/admin/chapters')
  redirect('/admin/chapters?deleted=1')
}
