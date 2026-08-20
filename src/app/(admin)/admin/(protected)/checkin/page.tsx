import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { checkInRegistration } from '@/lib/actions/admin/registrations'
import type { Prisma } from '@prisma/client'

function buildPath(eventId: string, q: string): string {
  const params = new URLSearchParams({ event: eventId })
  if (q) params.set('q', q)
  return `/admin/checkin?${params.toString()}`
}

export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; q?: string; checked?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { event: eventId, q, checked } = await searchParams
  const query = (q ?? '').trim()

  const events =
    user.role === 'CHECK_IN_STAFF'
      ? (
          await prisma.eventCheckInStaff.findMany({
            where: { userId: user.id },
            include: { event: { select: { id: true, title: true, startDate: true } } },
            orderBy: { event: { startDate: 'desc' } },
          })
        ).map((staffLink) => staffLink.event)
      : await prisma.event.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { startDate: 'desc' },
          select: { id: true, title: true, startDate: true },
        })

  const selectedEvent = eventId ? events.find((event) => event.id === eventId) : undefined

  let registrations: Prisma.RegistrationGetPayload<{ include: { person: true } }>[] = []
  if (selectedEvent) {
    const where: Prisma.RegistrationWhereInput = { eventId: selectedEvent.id }
    if (query) {
      where.person = {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      }
    }
    registrations = await prisma.registration.findMany({
      where,
      include: { person: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 font-serif text-2xl font-medium text-brand-primary">Check-In</h1>

      {checked === '1' && (
        <div className="mb-4 border border-brand-secondary bg-emerald-50 px-4 py-3 font-sans text-sm text-brand-secondary">
          Checked in.
        </div>
      )}

      {events.length === 0 ? (
        <p className="border border-dashed border-border-strong p-6 font-sans text-sm text-ink-muted">
          You aren&rsquo;t assigned to any events yet. Ask an Events Manager to add you as check-in staff.
        </p>
      ) : (
        <form method="GET" className="mb-6 flex flex-col gap-3">
          <div>
            <label htmlFor="event" className="mb-1.5 block font-sans text-xs font-semibold uppercase text-ink">
              Event
            </label>
            <select
              id="event"
              name="event"
              defaultValue={selectedEvent?.id ?? ''}
              className="w-full border border-border-strong bg-surface px-4 py-3 font-sans text-base text-ink focus:border-brand-primary focus:outline-none"
            >
              <option value="" disabled>
                Select an event
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {selectedEvent && (
            <div>
              <label htmlFor="q" className="mb-1.5 block font-sans text-xs font-semibold uppercase text-ink">
                Search name or email
              </label>
              <input
                id="q"
                name="q"
                type="text"
                defaultValue={query}
                placeholder="Start typing…"
                autoFocus
                className="w-full border border-border-strong bg-surface px-4 py-3 font-sans text-base text-ink focus:border-brand-primary focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-brand-primary px-4 py-4 font-sans text-sm font-semibold uppercase text-ink-inverse active:bg-navy-600"
            style={{ letterSpacing: '0.04em' }}
          >
            {selectedEvent ? 'Search' : 'Continue'}
          </button>
        </form>
      )}

      {selectedEvent && (
        <div className="flex flex-col gap-3">
          {registrations.length === 0 ? (
            <p className="font-sans text-sm text-ink-muted">
              {query ? 'No matching registrations.' : `No registrations for ${selectedEvent.title} yet.`}
            </p>
          ) : (
            registrations.map((registration) => {
              const alreadyCheckedIn = registration.status === 'CHECKED_IN' || registration.status === 'ATTENDED'
              return (
                <div
                  key={registration.id}
                  className="flex items-center justify-between gap-3 border border-border-subtle p-4"
                >
                  <div className="min-w-0">
                    <div className="truncate font-sans text-base font-semibold text-ink">
                      {registration.person.firstName} {registration.person.lastName}
                    </div>
                    <div className="truncate font-sans text-sm text-ink-muted">{registration.person.email}</div>
                  </div>
                  {alreadyCheckedIn ? (
                    <span
                      className="shrink-0 bg-emerald-50 px-4 py-3 font-sans text-sm font-semibold uppercase text-brand-secondary"
                      style={{ letterSpacing: '0.04em' }}
                    >
                      Checked in ✓
                    </span>
                  ) : (
                    <form action={checkInRegistration.bind(null, registration.id)}>
                      <input type="hidden" name="redirectTo" value={buildPath(selectedEvent.id, query)} />
                      <button
                        type="submit"
                        className="shrink-0 bg-brand-primary px-6 py-4 font-sans text-sm font-semibold uppercase text-ink-inverse active:bg-navy-600"
                        style={{ letterSpacing: '0.04em' }}
                      >
                        Check In
                      </button>
                    </form>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
