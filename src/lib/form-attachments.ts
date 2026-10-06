import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/format'
import { canManageEvents, canManagePrograms } from '@/lib/rbac'
import type { SessionUser } from '@/lib/auth'
import type { AttachTarget } from '@/lib/forms'

/**
 * Events and programs the Form Builder offers as attach targets. A list is
 * left undefined when the user's role can't edit that entity, which hides
 * that half of the picker (the save action re-checks the same rule).
 */
export async function loadAttachTargets(
  user: SessionUser,
): Promise<{ events?: AttachTarget[]; programs?: AttachTarget[] }> {
  const [events, programs] = await Promise.all([
    canManageEvents(user)
      ? prisma.event.findMany({
          orderBy: { startDate: 'desc' },
          select: { id: true, title: true, startDate: true, registrationForm: { select: { id: true, name: true } } },
        })
      : null,
    canManagePrograms(user)
      ? prisma.program.findMany({
          orderBy: { title: 'asc' },
          select: { id: true, title: true, applicationForm: { select: { id: true, name: true } } },
        })
      : null,
  ])

  return {
    events: events?.map((event) => ({
      id: event.id,
      title: event.title,
      detail: formatDate(event.startDate),
      currentForm: event.registrationForm,
    })),
    programs: programs?.map((program) => ({
      id: program.id,
      title: program.title,
      currentForm: program.applicationForm,
    })),
  }
}
