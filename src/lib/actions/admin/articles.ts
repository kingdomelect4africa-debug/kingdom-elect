'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser, AuthError, type SessionUser } from '@/lib/auth'
import { canEditArticle, canPublish } from '@/lib/rbac'
import { slugify } from '@/lib/format'
import type { ContentStatus, InsightCategory, PillarTag } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function articlePayload(formData: FormData) {
  return {
    title: str(formData, 'title'),
    slug: slugify(str(formData, 'slug') || str(formData, 'title')),
    subtitle: str(formData, 'subtitle') || null,
    category: str(formData, 'category') as InsightCategory,
    body: str(formData, 'body'),
    excerpt: str(formData, 'excerpt'),
    publishedDate: str(formData, 'publishedDate') ? new Date(str(formData, 'publishedDate')) : null,
    pillarTags: formData.getAll('pillarTags') as PillarTag[],
    relatedProgramId: str(formData, 'relatedProgramId') || null,
    relatedEventId: str(formData, 'relatedEventId') || null,
    featuredOnHomepage: formData.get('featuredOnHomepage') === 'on',
    seoTitle: str(formData, 'seoTitle') || null,
    seoDescription: str(formData, 'seoDescription') || null,
  }
}

/** An AUTHOR can never publish themselves — silently downgrade to IN_REVIEW rather than reject the save. */
function resolveStatus(formData: FormData, user: SessionUser): ContentStatus {
  const requested = str(formData, 'status') as ContentStatus
  if (requested === 'PUBLISHED' && !canPublish(user)) return 'IN_REVIEW'
  return requested
}

async function syncAuthors(articleId: string, formData: FormData) {
  const personIds = [...new Set(formData.getAll('authorIds').map(String).filter(Boolean))]
  const existing = await prisma.articleAuthor.findMany({ where: { articleId }, select: { personId: true } })
  const existingIds = new Set(existing.map((row) => row.personId))
  const nextIds = new Set(personIds)

  const toAdd = personIds.filter((id) => !existingIds.has(id))
  const toRemove = [...existingIds].filter((id) => !nextIds.has(id))

  if (toAdd.length === 0 && toRemove.length === 0) return

  await prisma.$transaction([
    ...toAdd.map((personId) => prisma.articleAuthor.create({ data: { articleId, personId } })),
    ...(toRemove.length ? [prisma.articleAuthor.deleteMany({ where: { articleId, personId: { in: toRemove } } })] : []),
  ])
}

export async function createArticle(formData: FormData) {
  const user = await requireUser(['AUTHOR', 'CONTENT_EDITOR'])
  const status = resolveStatus(formData, user)

  const article = await prisma.article.create({
    data: { ...articlePayload(formData), status, createdById: user.id },
  })
  await syncAuthors(article.id, formData)

  revalidatePath('/insights')
  revalidatePath('/admin/articles')
  redirect(`/admin/articles/${article.id}?saved=1`)
}

export async function updateArticle(articleId: string, formData: FormData) {
  const user = await requireUser(['AUTHOR', 'CONTENT_EDITOR'])
  const existing = await prisma.article.findUniqueOrThrow({ where: { id: articleId } })

  if (!canEditArticle(user, existing)) {
    throw new AuthError('Not authorized to edit this article')
  }

  const status = resolveStatus(formData, user)

  await prisma.article.update({
    where: { id: articleId },
    data: { ...articlePayload(formData), status },
  })
  await syncAuthors(articleId, formData)

  revalidatePath('/insights')
  revalidatePath(`/insights/${existing.slug}`)
  revalidatePath('/admin/articles')
  revalidatePath(`/admin/articles/${articleId}`)
  redirect(`/admin/articles/${articleId}?saved=1`)
}

export async function deleteArticle(articleId: string) {
  await requireUser(['CONTENT_EDITOR'])
  const existing = await prisma.article.findUniqueOrThrow({ where: { id: articleId } })
  await prisma.article.delete({ where: { id: articleId } })

  revalidatePath('/insights')
  revalidatePath(`/insights/${existing.slug}`)
  revalidatePath('/admin/articles')
  redirect('/admin/articles?deleted=1')
}
