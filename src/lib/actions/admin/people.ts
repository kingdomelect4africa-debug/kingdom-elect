'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { slugify } from '@/lib/format'
import { assertChapterAccess } from '@/lib/rbac'
import type { PersonStatus, PillarTag } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function personPayload(formData: FormData) {
  return {
    firstName: str(formData, 'firstName'),
    lastName: str(formData, 'lastName'),
    slug: slugify(str(formData, 'slug') || `${str(formData, 'firstName')}-${str(formData, 'lastName')}`),
    title: str(formData, 'title') || null,
    organizationId: str(formData, 'organizationId') || null,
    country: str(formData, 'country') || null,
    homeChapterId: str(formData, 'homeChapterId') || null,
    bio: str(formData, 'bio') || null,
    pillarTags: formData.getAll('pillarTags') as PillarTag[],
    email: str(formData, 'email') || null,
    phone: str(formData, 'phone') || null,
    consentToPublish: formData.get('consentToPublish') === 'on',
    status: str(formData, 'status') as PersonStatus,
  }
}

export async function createPerson(formData: FormData) {
  const user = await requireUser(['CHAPTER_ADMINISTRATOR'])
  const payload = personPayload(formData)

  // A Chapter Administrator may only ever create people inside their own
  // chapter — override whatever the form submitted.
  if (user.role === 'CHAPTER_ADMINISTRATOR') {
    if (!user.chapterId) throw new Error('No chapter assigned to this administrator')
    payload.homeChapterId = user.chapterId
  }

  const person = await prisma.person.create({ data: payload })
  revalidatePath('/admin/people')
  redirect(`/admin/people/${person.id}?saved=1`)
}

export async function updatePerson(personId: string, formData: FormData) {
  const user = await requireUser(['CHAPTER_ADMINISTRATOR'])
  const existing = await prisma.person.findUniqueOrThrow({ where: { id: personId } })
  assertChapterAccess(user, existing.homeChapterId)

  const payload = personPayload(formData)
  if (user.role === 'CHAPTER_ADMINISTRATOR') {
    if (!user.chapterId) throw new Error('No chapter assigned to this administrator')
    payload.homeChapterId = user.chapterId
  }

  await prisma.person.update({ where: { id: personId }, data: payload })
  revalidatePath('/admin/people')
  revalidatePath(`/admin/people/${personId}`)
  redirect(`/admin/people/${personId}?saved=1`)
}

export async function deletePerson(personId: string) {
  const user = await requireUser(['CHAPTER_ADMINISTRATOR'])
  const existing = await prisma.person.findUniqueOrThrow({ where: { id: personId } })
  assertChapterAccess(user, existing.homeChapterId)

  await prisma.person.delete({ where: { id: personId } })
  revalidatePath('/admin/people')
  redirect('/admin/people?deleted=1')
}
