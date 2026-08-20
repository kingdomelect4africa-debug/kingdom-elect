import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { createPerson } from '@/lib/actions/admin/people'
import { PageHeader } from '@/components/admin/ui'
import { PersonForm } from '@/components/admin/people/PersonForm'

export default async function NewPersonPage() {
  const user = await getCurrentUser()

  const [organizations, chapters, lockedChapter] = await Promise.all([
    prisma.organization.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.chapter.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    user?.role === 'CHAPTER_ADMINISTRATOR' && user.chapterId
      ? prisma.chapter.findUnique({ where: { id: user.chapterId }, select: { id: true, name: true } })
      : Promise.resolve(null),
  ])

  return (
    <div>
      <PageHeader title="Add Person" description="Every relationship — member, fellow, volunteer, speaker — starts with a single Person record." />
      <PersonForm action={createPerson} organizations={organizations} chapters={chapters} lockedChapter={lockedChapter ?? undefined} />
    </div>
  )
}
