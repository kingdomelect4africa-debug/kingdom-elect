import { prisma } from '@/lib/db'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'
import { formatDateRange } from '@/lib/format'
import Link from 'next/link'

const STATUS_TONE: Record<string, 'default' | 'success' | 'muted'> = { DRAFT: 'muted', PUBLISHED: 'success', ARCHIVED: 'default' }

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'desc' },
    include: { _count: { select: { registrations: true } }, chapter: { select: { name: true } } },
  })

  return (
    <div>
      <PageHeader title="Events" description="Every event on the public site is one of these records." actions={<PrimaryLinkButton href="/admin/events/new">Create Event</PrimaryLinkButton>} />

      {events.length === 0 ? (
        <EmptyState title="Your next gathering has not been published yet." body="Create an event to see it appear on the public site instantly." actionLabel="Create Event" actionHref="/admin/events/new" />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[720px]">
            <thead className="bg-navy-50">
              <tr><th className={th}>Title</th><th className={th}>Dates</th><th className={th}>Chapter</th><th className={th}>Registrations</th><th className={th}>Status</th><th className={th}></th></tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className={tr}>
                  <td className={td}>{event.title}</td>
                  <td className={td}>{formatDateRange(event.startDate, event.endDate)}</td>
                  <td className={td}>{event.chapter?.name ?? 'Continental'}</td>
                  <td className={td}>{event._count.registrations}</td>
                  <td className={td}><Badge tone={STATUS_TONE[event.status] ?? 'default'}>{event.status}</Badge></td>
                  <td className={td}><Link href={`/admin/events/${event.id}`} className="text-brand-primary underline-offset-4 hover:underline">Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
