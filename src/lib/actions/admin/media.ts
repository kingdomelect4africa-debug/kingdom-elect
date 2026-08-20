'use server'

import { mkdir, unlink, writeFile } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'

const MEDIA_ROLES = ['CONTENT_EDITOR', 'EVENTS_MANAGER', 'COMMUNICATIONS_MANAGER'] as const

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

export async function uploadMedia(formData: FormData) {
  await requireUser([...MEDIA_ROLES])

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

  // Local-disk storage: suitable for development only. Production should swap
  // this for real object storage (e.g. Cloudflare R2 / S3) behind this same
  // action signature — mirroring how payments/email are stubbed elsewhere in
  // this codebase (real records written, no live third-party wired up yet).
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]+/g, '-').toLowerCase() || 'file'
  const filename = `${randomBytes(8).toString('hex')}-${safeName}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadsDir, filename), buffer)

  await prisma.media.create({
    data: {
      filename: file.name || filename,
      url: `/uploads/${filename}`,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      alt,
      caption,
      credit,
      tags,
    },
  })

  revalidatePath('/admin/media')
  redirect('/admin/media?saved=1')
}

export async function deleteMedia(mediaId: string) {
  await requireUser([...MEDIA_ROLES])

  const media = await prisma.media.delete({ where: { id: mediaId } })

  // Best-effort cleanup of the underlying file — not required to succeed since
  // the DB row (the source of truth for the library) is already gone.
  if (media.url.startsWith('/uploads/')) {
    try {
      await unlink(path.join(process.cwd(), 'public', media.url))
    } catch {
      // Ignore — file may already be missing.
    }
  }

  revalidatePath('/admin/media')
  redirect('/admin/media?deleted=1')
}
