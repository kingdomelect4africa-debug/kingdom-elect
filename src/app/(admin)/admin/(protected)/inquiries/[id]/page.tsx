import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateInquiryStatus } from '@/lib/actions/admin/inquiries'
import { PageHeader, Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { INQUIRY_TYPE_LABELS } from '@/lib/inquiry-labels'
import { formatDate } from '@/lib/format'

const STATUS_OPTIONS = ['NEW', 'IN_PROGRESS', 'RESOLVED']

export default async function InquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { handledBy: { select: { name: true } } },
  })

  if (!inquiry) notFound()

  return (
    <div>
      <PageHeader
        title={inquiry.name}
        description={`${INQUIRY_TYPE_LABELS[inquiry.type]} — submitted ${formatDate(inquiry.createdAt)}`}
      />
      <SavedBanner saved={saved === '1'} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="border border-border-subtle p-6">
            <h2 className="font-serif text-lg text-brand-primary">Message</h2>
            <p className="mt-3 whitespace-pre-wrap font-sans text-sm text-ink">{inquiry.message}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-border-subtle p-6">
            <h2 className="font-serif text-lg text-brand-primary">Contact</h2>
            <dl className="mt-3 flex flex-col gap-3 font-sans text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase text-ink-muted">Email</dt>
                <dd className="text-ink">{inquiry.email}</dd>
              </div>
              {inquiry.phone && (
                <div>
                  <dt className="text-xs font-semibold uppercase text-ink-muted">Phone</dt>
                  <dd className="text-ink">{inquiry.phone}</dd>
                </div>
              )}
              {inquiry.organization && (
                <div>
                  <dt className="text-xs font-semibold uppercase text-ink-muted">Organization</dt>
                  <dd className="text-ink">{inquiry.organization}</dd>
                </div>
              )}
              {inquiry.handledBy && (
                <div>
                  <dt className="text-xs font-semibold uppercase text-ink-muted">Handled By</dt>
                  <dd className="text-ink">{inquiry.handledBy.name}</dd>
                </div>
              )}
            </dl>
          </div>

          <form action={updateInquiryStatus.bind(null, inquiry.id)} className="border border-border-subtle p-6">
            <Field label="Status" htmlFor="status" required>
              <select id="status" name="status" required defaultValue={inquiry.status} className={inputClasses}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </Field>
            <div className="mt-4">
              <SubmitButton>Update Status</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
