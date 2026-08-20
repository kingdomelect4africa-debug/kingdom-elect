import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateOrganization, deleteOrganization } from '@/lib/actions/admin/organizations'
import { PageHeader, SubmitButton } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { OrganizationForm } from '@/components/admin/organizations/OrganizationForm'

export default async function EditOrganizationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const [organization, people] = await Promise.all([
    prisma.organization.findUnique({ where: { id } }),
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
  ])

  if (!organization) notFound()

  return (
    <div>
      <PageHeader title={organization.name} />
      <SavedBanner saved={saved === '1'} />

      <OrganizationForm action={updateOrganization.bind(null, organization.id)} organization={organization} people={people} />

      <form action={deleteOrganization.bind(null, organization.id)} className="mt-8">
        <SubmitButton variant="danger">Delete Partner</SubmitButton>
      </form>
    </div>
  )
}
