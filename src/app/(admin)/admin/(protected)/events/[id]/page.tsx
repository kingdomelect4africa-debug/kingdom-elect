import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateEvent, deleteEvent, addSpeakerToEvent, removeSpeakerFromEvent } from '@/lib/actions/admin/events'
import { PageHeader, SubmitButton, inputClasses, Field } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { EventForm } from '@/components/admin/events/EventForm'

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const [event, forms, chapters, people] = await Promise.all([
    prisma.event.findUnique({
      where: { id },
      include: {
        speakers: { include: { person: true } },
        _count: { select: { registrations: true } },
      },
    }),
    prisma.formDefinition.findMany({ select: { id: true, name: true } }),
    prisma.chapter.findMany({ select: { id: true, name: true } }),
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
  ])

  if (!event) notFound()

  return (
    <div>
      <PageHeader
        title={event.title}
        description={`${event._count.registrations} registration(s)`}
        actions={<Link href={`/admin/registrations?event=${event.id}`} className="font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline" style={{ letterSpacing: '0.06em' }}>View Registrations →</Link>}
      />
      <SavedBanner saved={saved === '1'} />

      <EventForm action={updateEvent.bind(null, event.id)} event={event} forms={forms} chapters={chapters} />

      <div className="mt-10 max-w-3xl border border-border-subtle p-6">
        <h2 className="font-serif text-lg text-brand-primary">Speakers</h2>
        <div className="mt-4 flex flex-col gap-2">
          {event.speakers.length === 0 && <p className="font-sans text-sm text-ink-muted">No speakers added yet.</p>}
          {event.speakers.map((speaker) => (
            <div key={speaker.id} className="flex items-center justify-between border-t border-border-subtle py-2 first:border-t-0">
              <span className="font-sans text-sm text-ink">{speaker.person.firstName} {speaker.person.lastName}</span>
              <form action={removeSpeakerFromEvent.bind(null, event.id, speaker.id)}>
                <button type="submit" className="font-sans text-xs uppercase text-red-700 hover:underline">Remove</button>
              </form>
            </div>
          ))}
        </div>

        <form action={addSpeakerToEvent.bind(null, event.id)} className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <Field label="Add Speaker" htmlFor="personId">
              <select id="personId" name="personId" className={inputClasses} defaultValue="">
                <option value="" disabled>Select a person</option>
                {people.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </Field>
          </div>
          <SubmitButton>Add</SubmitButton>
        </form>
        <p className="mt-3 font-sans text-xs text-ink-muted">
          Don&rsquo;t see the person you&rsquo;re looking for? <Link href="/admin/people/new" className="underline">Add them to People</Link> first.
        </p>
      </div>

      <form action={deleteEvent.bind(null, event.id)} className="mt-8">
        <SubmitButton variant="danger">Delete Event</SubmitButton>
      </form>
    </div>
  )
}
