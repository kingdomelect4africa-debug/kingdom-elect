'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { slugify } from '@/lib/format'
import type { ContentStatus } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function storyPayload(formData: FormData) {
  return {
    title: str(formData, 'title'),
    slug: slugify(str(formData, 'slug') || str(formData, 'title')),
    personFeaturedId: str(formData, 'personFeaturedId'),
    summary: str(formData, 'summary'),
    body: str(formData, 'body'),
    videoUrl: str(formData, 'videoUrl') || null,
    relatedChapterId: str(formData, 'relatedChapterId') || null,
    relatedProgramId: str(formData, 'relatedProgramId') || null,
    relatedEventId: str(formData, 'relatedEventId') || null,
    publishedDate: str(formData, 'publishedDate') ? new Date(str(formData, 'publishedDate')) : null,
    status: str(formData, 'status') as ContentStatus,
    featuredOnHomepage: formData.get('featuredOnHomepage') === 'on',
    seoTitle: str(formData, 'seoTitle') || null,
    seoDescription: str(formData, 'seoDescription') || null,
  }
}

export async function createStory(formData: FormData) {
  await requireUser(['CONTENT_EDITOR'])
  const story = await prisma.story.create({ data: storyPayload(formData) })
  revalidatePath('/stories')
  revalidatePath('/admin/stories')
  redirect(`/admin/stories/${story.id}?saved=1`)
}

export async function updateStory(storyId: string, formData: FormData) {
  await requireUser(['CONTENT_EDITOR'])
  const existing = await prisma.story.findUniqueOrThrow({ where: { id: storyId } })
  await prisma.story.update({ where: { id: storyId }, data: storyPayload(formData) })

  revalidatePath('/stories')
  revalidatePath(`/stories/${existing.slug}`)
  revalidatePath('/admin/stories')
  revalidatePath(`/admin/stories/${storyId}`)
  redirect(`/admin/stories/${storyId}?saved=1`)
}

export async function deleteStory(storyId: string) {
  await requireUser(['CONTENT_EDITOR'])
  const existing = await prisma.story.findUniqueOrThrow({ where: { id: storyId } })
  await prisma.story.delete({ where: { id: storyId } })

  revalidatePath('/stories')
  revalidatePath(`/stories/${existing.slug}`)
  revalidatePath('/admin/stories')
  redirect('/admin/stories?deleted=1')
}
