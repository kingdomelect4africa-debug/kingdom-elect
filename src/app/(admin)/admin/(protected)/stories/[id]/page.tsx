import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateStory, deleteStory } from '@/lib/actions/admin/stories'
import { PageHeader, SubmitButton } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { StoryForm } from '@/components/admin/stories/StoryForm'

export default async function EditStoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const [story, people, chapters, programs, events] = await Promise.all([
    prisma.story.findUnique({ where: { id } }),
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
    prisma.chapter.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.program.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true } }),
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, title: true } }),
  ])

  if (!story) notFound()

  return (
    <div>
      <PageHeader title={story.title} />
      <SavedBanner saved={saved === '1'} />

      <StoryForm
        action={updateStory.bind(null, story.id)}
        story={story}
        people={people}
        chapters={chapters}
        programs={programs}
        events={events}
      />

      <form action={deleteStory.bind(null, story.id)} className="mt-8">
        <SubmitButton variant="danger">Delete Story</SubmitButton>
      </form>
    </div>
  )
}
