import { prisma } from '@/lib/db'
import { createStory } from '@/lib/actions/admin/stories'
import { PageHeader } from '@/components/admin/ui'
import { StoryForm } from '@/components/admin/stories/StoryForm'

export default async function NewStoryPage() {
  const [people, chapters, programs, events] = await Promise.all([
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
    prisma.chapter.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.program.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true } }),
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, title: true } }),
  ])

  return (
    <div>
      <PageHeader title="Create Story" description="Publishes to /stories once approved." />
      <StoryForm action={createStory} people={people} chapters={chapters} programs={programs} events={events} />
    </div>
  )
}
