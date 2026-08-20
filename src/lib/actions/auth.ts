'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { verifyPassword, createSession, setSessionCookie, destroySession, getCurrentUser, SESSION_COOKIE_NAME } from '@/lib/auth'
import { cookies } from 'next/headers'

export type LoginActionState = { status: 'idle' | 'error'; message: string }

export async function login(_prevState: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const email = (formData.get('email') as string | null)?.trim().toLowerCase()
  const password = formData.get('password') as string | null

  if (!email || !password) {
    return { status: 'error', message: 'Please enter your email and password.' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.active) {
    return { status: 'error', message: 'Invalid email or password.' }
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return { status: 'error', message: 'Invalid email or password.' }
  }

  const token = await createSession(user.id)
  await setSessionCookie(token)
  redirect('/admin/dashboard')
}

export async function logout() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE_NAME)?.value
  if (token) await destroySession(token)
  store.delete(SESSION_COOKIE_NAME)
  redirect('/admin/login')
}

export async function requireAdminUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')
  return user
}
