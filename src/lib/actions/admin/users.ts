'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { hashPassword } from '@/lib/password'
import type { Role } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

// Deliberately not trimmed: the login flow (src/lib/actions/auth.ts) reads the
// password straight off the FormData without trimming, so trimming it here
// would make a password containing leading/trailing whitespace unable to log in.
function rawPassword(formData: FormData): string {
  return (formData.get('password') as string | null) ?? ''
}

function userPayload(formData: FormData) {
  const role = str(formData, 'role') as Role
  return {
    email: str(formData, 'email').toLowerCase(),
    name: str(formData, 'name'),
    role,
    // chapterId is only meaningful for Chapter Administrators — clear it otherwise
    // so stale chapter scoping never lingers on a role change.
    chapterId: role === 'CHAPTER_ADMINISTRATOR' ? str(formData, 'chapterId') || null : null,
    personId: str(formData, 'personId') || null,
    active: formData.get('active') === 'on',
  }
}

export async function createUser(formData: FormData) {
  await requireUser(['SUPER_ADMIN'])

  const password = rawPassword(formData)
  if (!password || password.length < 8) {
    throw new Error('A password of at least 8 characters is required to create a user.')
  }

  const user = await prisma.user.create({
    data: {
      ...userPayload(formData),
      passwordHash: await hashPassword(password),
    },
  })

  revalidatePath('/admin/users')
  redirect(`/admin/users/${user.id}?saved=1`)
}

export async function updateUser(userId: string, formData: FormData) {
  await requireUser(['SUPER_ADMIN'])

  const password = rawPassword(formData)

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...userPayload(formData),
      // Only touch passwordHash if a new password was actually typed — leaving
      // the field blank on the edit form must never overwrite the existing hash.
      ...(password ? { passwordHash: await hashPassword(password) } : {}),
    },
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)
  redirect(`/admin/users/${userId}?saved=1`)
}

export async function deactivateUser(userId: string) {
  await requireUser(['SUPER_ADMIN'])
  await prisma.user.update({ where: { id: userId }, data: { active: false } })
  revalidatePath('/admin/users')
  redirect('/admin/users?saved=1')
}

export async function reactivateUser(userId: string) {
  await requireUser(['SUPER_ADMIN'])
  await prisma.user.update({ where: { id: userId }, data: { active: true } })
  revalidatePath('/admin/users')
  redirect('/admin/users?saved=1')
}
