import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageHeader, Badge } from '@/components/admin/ui'
import { formatDate } from '@/lib/format'

const STATUS_TONE: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
  REGISTERED: 'default',
  CONFIRMED: 'default',
  CHECKED_IN: 'success',
  ATTENDED: 'success',
  NO_SHOW: 'muted',
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function ResponseValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-ink-muted">—</span>
  }
  if (typeof value === 'boolean') {
    return <Badge tone={value ? 'success' : 'muted'}>{value ? 'Yes' : 'No'}</Badge>
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-ink-muted">—</span>
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((item, i) => (
          <Badge key={i} tone="default">
            {String(item)}
          </Badge>
        ))}
      </div>
    )
  }
  return <span className="whitespace-pre-wrap">{String(value)}</span>
}

export default async function AdminRegistrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const registration = await prisma.registration.findUnique({
    where: { id },
    include: { person: true, event: { select: { id: true, title: true, slug: true } } },
  })

  if (!registration) notFound()

  const responses = (registration.responses ?? {}) as Record<string, unknown>
  const submittedAt = typeof responses.submitted_at === 'string' ? responses.submitted_at : null

  return (
    <div>
      <PageHeader
        title={`${registration.person.firstName} ${registration.person.lastName}`}
        description={registration.event.title}
        actions={
          <Link href="/admin/registrations" className="font-sans text-xs font-semibold uppercase text-brand-primary hover:underline">
            ← All Registrations
          </Link>
        }
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Badge tone={STATUS_TONE[registration.status] ?? 'default'}>{registration.status.replace(/_/g, ' ')}</Badge>
        <span className="font-sans text-sm text-ink-muted">Registered {formatDate(registration.createdAt)}</span>
        {submittedAt && <span className="font-sans text-sm text-ink-muted">· Submitted {formatDate(new Date(submittedAt))}</span>}
      </div>

      <div className="mb-10 grid gap-4 border border-border-subtle p-6 sm:grid-cols-2">
        <div>
          <p className="font-sans text-xs font-semibold uppercase text-ink-muted">Email</p>
          <p className="mt-1 font-sans text-sm text-ink">{registration.person.email ?? '—'}</p>
        </div>
        <div>
          <p className="font-sans text-xs font-semibold uppercase text-ink-muted">Phone</p>
          <p className="mt-1 font-sans text-sm text-ink">{registration.person.phone ?? '—'}</p>
        </div>
      </div>

      <h2 className="mb-4 font-serif text-lg text-brand-primary">Registration Responses</h2>
      <div className="flex flex-col divide-y divide-border-subtle border border-border-subtle">
        {Object.entries(responses)
          .filter(([key]) => key !== 'submitted_at')
          .map(([key, value]) => (
            <div key={key} className="grid gap-1 px-5 py-4 sm:grid-cols-[280px_1fr] sm:gap-4">
              <p className="font-sans text-xs font-semibold uppercase text-ink-muted">{humanizeKey(key)}</p>
              <div className="font-sans text-sm text-ink">
                <ResponseValue value={value} />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
