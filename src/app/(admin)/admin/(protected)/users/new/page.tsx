import { prisma } from '@/lib/db'
import { createUser } from '@/lib/actions/admin/users'
import { PageHeader } from '@/components/admin/ui'
import { UserForm } from '@/components/admin/users/UserForm'

export default async function NewUserPage() {
  const [chapters, people] = await Promise.all([
    prisma.chapter.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.person.findMany({ select: { id: true, firstName: true, lastName: true }, orderBy: { firstName: 'asc' } }),
  ])

  return (
    <div>
      <PageHeader title="Create User" />
      <UserForm action={createUser} chapters={chapters} people={people} />
    </div>
  )
}
