import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateUser } from '@/lib/actions/admin/users'
import { PageHeader } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { UserForm } from '@/components/admin/users/UserForm'

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const [user, chapters, people] = await Promise.all([
    prisma.user.findUnique({ where: { id } }),
    prisma.chapter.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.person.findMany({ select: { id: true, firstName: true, lastName: true }, orderBy: { firstName: 'asc' } }),
  ])

  if (!user) notFound()

  return (
    <div>
      <PageHeader title={user.name} description={user.email} />
      <SavedBanner saved={saved === '1'} />
      <UserForm action={updateUser.bind(null, user.id)} user={user} chapters={chapters} people={people} />
    </div>
  )
}
