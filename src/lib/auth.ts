import { randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import type { Role, User } from '@prisma/client'

export { hashPassword, verifyPassword } from '@/lib/password'

export const SESSION_COOKIE_NAME = 'ke_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  })
  return token
}

export async function setSessionCookie(token: string) {
  const store = await cookies()
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE_NAME)
}

export async function destroySession(token: string) {
  await prisma.session.deleteMany({ where: { token } })
}

export type SessionUser = Pick<User, 'id' | 'email' | 'name' | 'role' | 'chapterId' | 'active'>

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date() || !session.user.active) {
    return null
  }

  const { id, email, name, role, chapterId, active } = session.user
  return { id, email, name, role, chapterId, active }
}

export class AuthError extends Error {}

export async function requireUser(allowedRoles?: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) throw new AuthError('Not authenticated')
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'SUPER_ADMIN') {
    throw new AuthError('Not authorized')
  }
  return user
}
