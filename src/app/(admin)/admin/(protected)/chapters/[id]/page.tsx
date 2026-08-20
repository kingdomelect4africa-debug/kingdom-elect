import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { updateChapter, deleteChapter } from '@/lib/actions/admin/chapters'
import { PageHeader, SubmitButton } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { ChapterForm } from '@/components/admin/chapters/ChapterForm'

export default async function EditChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams
  const user = await getCurrentUser()

  const [chapter, people] = await Promise.all([
    prisma.chapter.findUnique({ where: { id } }),
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
  ])

  if (!chapter) notFound()

  // A Chapter Administrator may only see/edit their own chapter.
  if (user?.role === 'CHAPTER_ADMINISTRATOR' && user.chapterId !== chapter.id) notFound()

  return (
    <div>
      <PageHeader title={chapter.name} description={chapter.country} />
      <SavedBanner saved={saved === '1'} />

      <ChapterForm action={updateChapter.bind(null, chapter.id)} chapter={chapter} people={people} />

      {user?.role === 'SUPER_ADMIN' && (
        <form action={deleteChapter.bind(null, chapter.id)} className="mt-8">
          <SubmitButton variant="danger">Delete Chapter</SubmitButton>
        </form>
      )}
    </div>
  )
}
