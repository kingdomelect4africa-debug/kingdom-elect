import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PageHeader, Badge, EmptyState, th, td, tr, SubmitButton, inputClasses } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { updateRegistrationStatus } from '@/lib/actions/admin/registrations'
import { formatDate } from '@/lib/format'

const STATUS_OPTIONS = ['REGISTERED', 'CONFIRMED', 'CHECKED_IN', 'ATTENDED', 'NO_SHOW']

const STATUS_TONE: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
  REGISTERED: 'default',
  CONFIRMED: 'default',
  CHECKED_IN: 'success',
  ATTENDED: 'success',
  NO_SHOW: 'muted',
}

const PAYMENT_TONE: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
  NOT_APPLICABLE: 'muted',
  PENDING: 'warning',
  PAID: 'success',
  FAILED: 'muted',
  REFUNDED: 'muted',
}

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; saved?: string }>
}) {
  const { event: eventId, saved } = await searchParams

  const [registrations, events] = await Promise.all([
    prisma.registration.findMany({
      where: eventId ? { eventId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { person: true, event: { select: { id: true, title: true } } },
    }),
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, title: true } }),
  ])

  const currentPath = eventId ? `/admin/registrations?event=${eventId}` : '/admin/registrations'

  return (
    <div>
      <PageHeader title="Registrations" description="Everyone who has registered for an event, across every event." />
      <SavedBanner saved={saved === '1'} />

      <form method="GET" className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-xs flex-1">
          <label htmlFor="event" className="mb-1.5 block font-sans text-xs font-semibold uppercase text-ink">
            Filter by Event
          </label>
          <select id="event" name="event" defaultValue={eventId ?? ''} className={inputClasses}>
            <option value="">All events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
        <SubmitButton>Filter</SubmitButton>
        {eventId && (
          <Link href="/admin/registrations" className="font-sans text-xs uppercase text-ink-muted underline-offset-4 hover:underline">
            Clear filter
          </Link>
        )}
      </form>

      {registrations.length === 0 ? (
        <EmptyState title="No registrations yet." body="Registrations will appear here as people sign up for events." />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[920px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Person</th>
                <th className={th}>Event</th>
                <th className={th}>Status</th>
                <th className={th}>Registered</th>
                <th className={th}>Payment</th>
                <th className={th}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id} className={tr}>
                  <td className={td}>
                    <div>
                      {registration.person.firstName} {registration.person.lastName}
                    </div>
                    <div className="text-ink-muted">{registration.person.email}</div>
                  </td>
                  <td className={td}>{registration.event.title}</td>
                  <td className={td}>
                    <Badge tone={STATUS_TONE[registration.status] ?? 'default'}>{registration.status.replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className={td}>{formatDate(registration.createdAt)}</td>
                  <td className={td}>
                    <Badge tone={PAYMENT_TONE[registration.paymentStatus] ?? 'default'}>
                      {registration.paymentStatus.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className={td}>
                    <form action={updateRegistrationStatus.bind(null, registration.id)} className="flex items-center gap-2">
                      <input type="hidden" name="redirectTo" value={currentPath} />
                      <select
                        name="status"
                        defaultValue={registration.status}
                        className="border border-border-strong bg-surface px-2 py-1.5 font-sans text-xs text-ink focus:border-brand-primary focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="font-sans text-xs font-semibold uppercase text-brand-primary hover:underline">
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
