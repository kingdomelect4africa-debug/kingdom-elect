import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { canViewReviewerNotes } from '@/lib/rbac'
import { updateApplicationStatus } from '@/lib/actions/admin/applications'
import { PageHeader, Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { formatDate } from '@/lib/format'
import type { ApplicationStatus } from '@prisma/client'

const STATUS_OPTIONS: ApplicationStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'ENROLLED', 'WITHDRAWN']

function formatResponseValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.map((v) => String(v)).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const [application, user] = await Promise.all([
    prisma.application.findUnique({
      where: { id },
      include: {
        person: true,
        program: { select: { id: true, title: true } },
        cohort: { select: { id: true, name: true } },
        reviewedBy: { select: { name: true } },
      },
    }),
    getCurrentUser(),
  ])

  if (!application) notFound()

  const responses = (application.responses ?? {}) as Record<string, unknown>
  const responseEntries = Object.entries(responses)
  const canReview = user ? canViewReviewerNotes(user) : false

  return (
    <div>
      <PageHeader
        title={`${application.person.firstName} ${application.person.lastName}`}
        description={`Applied to ${application.program.title}${application.cohort ? ` — ${application.cohort.name}` : ''} on ${formatDate(application.createdAt)}`}
        actions={
          <Link
            href={`/admin/programs/${application.program.id}`}
            className="font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline"
            style={{ letterSpacing: '0.06em' }}
          >
            View Program →
          </Link>
        }
      />
      <SavedBanner saved={saved === '1'} />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="border border-border-subtle p-6">
            <h2 className="font-serif text-lg text-brand-primary">Applicant</h2>
            <dl className="mt-4 flex flex-col gap-2 font-sans text-sm">
              <div className="flex justify-between gap-4 border-t border-border-subtle pt-2 first:border-t-0 first:pt-0">
                <dt className="text-ink-muted">Name</dt>
                <dd className="text-ink">{application.person.firstName} {application.person.lastName}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border-subtle pt-2">
                <dt className="text-ink-muted">Email</dt>
                <dd className="text-ink">{application.person.email ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border-subtle pt-2">
                <dt className="text-ink-muted">Phone</dt>
                <dd className="text-ink">{application.person.phone ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border-subtle pt-2">
                <dt className="text-ink-muted">Country</dt>
                <dd className="text-ink">{application.person.country ?? '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="border border-border-subtle p-6">
            <h2 className="font-serif text-lg text-brand-primary">Form Responses</h2>
            {responseEntries.length === 0 ? (
              <p className="mt-4 font-sans text-sm text-ink-muted">No form responses recorded.</p>
            ) : (
              <dl className="mt-4 flex flex-col gap-3 font-sans text-sm">
                {responseEntries.map(([key, value]) => (
                  <div key={key} className="border-t border-border-subtle pt-3 first:border-t-0 first:pt-0">
                    <dt className="font-sans text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: '0.05em' }}>{key}</dt>
                    <dd className="mt-1 text-ink">{formatResponseValue(value)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        <div className="border border-border-subtle p-6">
          <h2 className="font-serif text-lg text-brand-primary">Review</h2>
          <form action={updateApplicationStatus.bind(null, application.id)} className="mt-4 flex flex-col gap-4">
            <Field label="Status" htmlFor="status" required>
              <select id="status" name="status" required defaultValue={application.status} className={inputClasses}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </Field>

            {canReview ? (
              <Field label="Reviewer Notes" htmlFor="reviewerNotes" hint="Only visible to Program Managers and Super Admins.">
                <textarea id="reviewerNotes" name="reviewerNotes" rows={6} defaultValue={application.reviewerNotes ?? ''} className={inputClasses} />
              </Field>
            ) : (
              <p className="font-sans text-xs text-ink-muted">Reviewer notes are only visible to Program Managers and Super Admins.</p>
            )}

            {application.reviewedBy && (
              <p className="font-sans text-xs text-ink-muted">Last reviewed by {application.reviewedBy.name}.</p>
            )}

            <div>
              <SubmitButton>Save Review</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
