import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { createChapter } from '@/lib/actions/admin/chapters'
import { PageHeader } from '@/components/admin/ui'
import { ChapterForm } from '@/components/admin/chapters/ChapterForm'

export default async function NewChapterPage() {
  const user = await getCurrentUser()
  // Opening a chapter is a continental-expansion decision — Super Admin only.
  if (user?.role !== 'SUPER_ADMIN') redirect('/admin/chapters')

  const people = await prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } })

  return (
    <div>
      <PageHeader title="Create Chapter" description="Structural, continental-expansion decisions live here." />
      <ChapterForm action={createChapter} people={people} />
    </div>
  )
}
