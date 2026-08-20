import type { Role } from '@prisma/client'
import type { SessionUser } from '@/lib/auth'

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Administrator',
  CONTENT_EDITOR: 'Content Editor',
  EVENTS_MANAGER: 'Events Manager',
  PROGRAM_MANAGER: 'Program Manager',
  COMMUNICATIONS_MANAGER: 'Communications Manager',
  CHAPTER_ADMINISTRATOR: 'Chapter Administrator',
  FINANCE_ADMINISTRATOR: 'Finance Administrator',
  CHECK_IN_STAFF: 'Check-In Staff',
  AUTHOR: 'Author',
}

export type Domain =
  | 'dashboard'
  | 'content'
  | 'events'
  | 'programs'
  | 'people'
  | 'chapters'
  | 'partnerships'
  | 'finance'
  | 'communications'
  | 'forms'
  | 'media'
  | 'users'
  | 'checkin'
  | 'settings'

const ROLE_DOMAINS: Record<Role, Domain[]> = {
  SUPER_ADMIN: [
    'dashboard', 'content', 'events', 'programs', 'people', 'chapters',
    'partnerships', 'finance', 'communications', 'forms', 'media', 'users',
    'checkin', 'settings',
  ],
  CONTENT_EDITOR: ['dashboard', 'content', 'media'],
  EVENTS_MANAGER: ['dashboard', 'events', 'checkin', 'forms', 'media'],
  PROGRAM_MANAGER: ['dashboard', 'programs', 'forms'],
  COMMUNICATIONS_MANAGER: ['dashboard', 'communications', 'media'],
  CHAPTER_ADMINISTRATOR: ['dashboard', 'chapters', 'people', 'events'],
  FINANCE_ADMINISTRATOR: ['dashboard', 'finance', 'partnerships'],
  CHECK_IN_STAFF: ['dashboard', 'checkin'],
  AUTHOR: ['dashboard', 'content'],
}

export function canAccessDomain(user: SessionUser, domain: Domain): boolean {
  if (user.role === 'SUPER_ADMIN') return true
  return ROLE_DOMAINS[user.role]?.includes(domain) ?? false
}

export function accessibleDomains(user: SessionUser): Domain[] {
  if (user.role === 'SUPER_ADMIN') return ROLE_DOMAINS.SUPER_ADMIN
  return ROLE_DOMAINS[user.role] ?? []
}

/** Row-level scoping for Chapter Administrators — {} for every other role. */
export function chapterScopeWhere(user: SessionUser): { chapterId: string } | Record<string, never> {
  if (user.role === 'CHAPTER_ADMINISTRATOR' && user.chapterId) {
    return { chapterId: user.chapterId }
  }
  return {}
}

export function assertChapterAccess(user: SessionUser, chapterId: string | null | undefined) {
  if (user.role === 'SUPER_ADMIN') return
  if (user.role === 'CHAPTER_ADMINISTRATOR' && user.chapterId !== chapterId) {
    throw new Error('Not authorized for this chapter')
  }
}

export function canViewFinancialValue(user: SessionUser): boolean {
  return user.role === 'SUPER_ADMIN' || user.role === 'FINANCE_ADMINISTRATOR'
}

export function canViewReviewerNotes(user: SessionUser): boolean {
  return user.role === 'SUPER_ADMIN' || user.role === 'PROGRAM_MANAGER'
}

export function canPublish(user: SessionUser): boolean {
  return user.role === 'SUPER_ADMIN' || user.role === 'CONTENT_EDITOR' || user.role === 'COMMUNICATIONS_MANAGER'
}

/** Authors may only edit their own, unpublished drafts. */
export function canEditArticle(user: SessionUser, article: { createdById: string | null; status: string }): boolean {
  if (user.role === 'SUPER_ADMIN' || user.role === 'CONTENT_EDITOR') return true
  if (user.role === 'AUTHOR') return article.createdById === user.id && article.status !== 'PUBLISHED'
  return false
}
