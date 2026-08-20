import { prisma } from '@/lib/db'
import { createOrganization } from '@/lib/actions/admin/organizations'
import { PageHeader } from '@/components/admin/ui'
import { OrganizationForm } from '@/components/admin/organizations/OrganizationForm'

export default async function NewOrganizationPage() {
  const people = await prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } })

  return (
    <div>
      <PageHeader title="Add Partner" />
      <OrganizationForm action={createOrganization} people={people} />
    </div>
  )
}
