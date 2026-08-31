'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { buildObjectKey, deleteObject, deliveryUrlFor, uploadObject } from '@/lib/r2'

const MEDIA_ROLES = ['CONTENT_EDITOR', 'EVENTS_MANAGER', 'COMMUNICATIONS_MANAGER'] as const

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

export async function uploadMedia(formData: FormData) {
  const user = await requireUser([...MEDIA_ROLES])

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Please choose a file to upload.')
  }

  const alt = str(formData, 'alt')
  if (!alt) {
    throw new Error('Alt text is required for every upload.')
  }
  const caption = str(formData, 'caption') || null
  const credit = str(formData, 'credit') || null
  const tags = str(formData, 'tags')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  const objectKey = buildObjectKey('media/library', file.name || 'file')
  const buffer = Buffer.from(await file.arrayBuffer())
  await uploadObject(objectKey, buffer, file.type || 'application/octet-stream')

  await prisma.media.create({
    data: {
      filename: file.name || objectKey,
      originalFilename: file.name || null,
      r2ObjectKey: objectKey,
      url: deliveryUrlFor(objectKey),
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      alt,
      caption,
      credit,
      tags,
      uploadedById: user.id,
    },
  })

  revalidatePath('/admin/media')
  redirect('/admin/media?saved=1')
}

export async function deleteMedia(mediaId: string) {
  await requireUser([...MEDIA_ROLES])

  const media = await prisma.media.delete({ where: { id: mediaId } })

  // Best-effort cleanup of the underlying object — not required to succeed
  // since the DB row (the source of truth for the library) is already gone.
  try {
    await deleteObject(media.r2ObjectKey)
  } catch {
    // Ignore — object may already be missing.
  }

  revalidatePath('/admin/media')
  redirect('/admin/media?deleted=1')
}
