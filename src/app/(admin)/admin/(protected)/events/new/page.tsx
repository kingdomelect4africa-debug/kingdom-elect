import { prisma } from '@/lib/db'
import { createEvent } from '@/lib/actions/admin/events'
import { PageHeader } from '@/components/admin/ui'
import { EventForm } from '@/components/admin/events/EventForm'

export default async function NewEventPage() {
  const [forms, chapters] = await Promise.all([
    prisma.formDefinition.findMany({ select: { id: true, name: true } }),
    prisma.chapter.findMany({ select: { id: true, name: true } }),
  ])

  return (
    <div>
      <PageHeader title="Create Event" />
      <EventForm action={createEvent} forms={forms} chapters={chapters} />
    </div>
  )
}
