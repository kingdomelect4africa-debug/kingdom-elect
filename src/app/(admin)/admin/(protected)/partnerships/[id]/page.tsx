import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { canViewFinancialValue } from '@/lib/rbac'
import { updatePartnership, deletePartnership } from '@/lib/actions/admin/partnerships'
import { PageHeader, SubmitButton } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { PartnershipForm } from '@/components/admin/partnerships/PartnershipForm'

export default async function EditPartnershipPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams
  const user = await getCurrentUser()
  const showValue = !!user && canViewFinancialValue(user)

  const [partnership, organizations, programs, events, chapters, people] = await Promise.all([
    prisma.partnership.findUnique({ where: { id }, include: { organization: { select: { name: true } } } }),
    prisma.organization.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.program.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true } }),
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, title: true } }),
    prisma.chapter.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
  ])

  if (!partnership) notFound()

  return (
    <div>
      <PageHeader title={partnership.organization.name} description={partnership.type.replace(/_/g, ' ')} />
      <SavedBanner saved={saved === '1'} />

      <PartnershipForm
        action={updatePartnership.bind(null, partnership.id)}
        partnership={partnership}
        organizations={organizations}
        programs={programs}
        events={events}
        chapters={chapters}
        people={people}
        showValue={showValue}
      />

      <form action={deletePartnership.bind(null, partnership.id)} className="mt-8">
        <SubmitButton variant="danger">Delete Partnership</SubmitButton>
      </form>
    </div>
  )
}
