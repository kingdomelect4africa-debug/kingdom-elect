import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { canViewFinancialValue } from '@/lib/rbac'
import { createPartnership } from '@/lib/actions/admin/partnerships'
import { PageHeader } from '@/components/admin/ui'
import { PartnershipForm } from '@/components/admin/partnerships/PartnershipForm'

export default async function NewPartnershipPage() {
  const user = await getCurrentUser()
  const showValue = !!user && canViewFinancialValue(user)

  const [organizations, programs, events, chapters, people] = await Promise.all([
    prisma.organization.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.program.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true } }),
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, title: true } }),
    prisma.chapter.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
  ])

  return (
    <div>
      <PageHeader title="Create Partnership" />
      <PartnershipForm
        action={createPartnership}
        organizations={organizations}
        programs={programs}
        events={events}
        chapters={chapters}
        people={people}
        showValue={showValue}
      />
    </div>
  )
}
