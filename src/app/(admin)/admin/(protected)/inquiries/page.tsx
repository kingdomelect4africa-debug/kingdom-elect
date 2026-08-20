import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PageHeader, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'
import { formatDate } from '@/lib/format'
import { INQUIRY_TYPE_LABELS } from '@/lib/inquiry-labels'
import { cn } from '@/lib/cn'
import type { InquiryStatus } from '@prisma/client'

const STATUS_OPTIONS: InquiryStatus[] = ['NEW', 'IN_PROGRESS', 'RESOLVED']
const STATUS_TONE: Record<InquiryStatus, 'warning' | 'default' | 'success'> = {
  NEW: 'warning',
  IN_PROGRESS: 'default',
  RESOLVED: 'success',
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const activeStatus = STATUS_OPTIONS.includes(status as InquiryStatus) ? (status as InquiryStatus) : undefined

  const inquiries = await prisma.inquiry.findMany({
    where: activeStatus ? { status: activeStatus } : {},
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <PageHeader title="Inquiries" description="Contact and get-involved form submissions from the public site." />

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/inquiries"
          className={cn(
            'px-3 py-1.5 font-sans text-xs font-semibold uppercase',
            !activeStatus ? 'bg-brand-primary text-ink-inverse' : 'bg-navy-50 text-ink-muted hover:bg-navy-100',
          )}
        >
          All
        </Link>
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/inquiries?status=${s}`}
            className={cn(
              'px-3 py-1.5 font-sans text-xs font-semibold uppercase',
              activeStatus === s ? 'bg-brand-primary text-ink-inverse' : 'bg-navy-50 text-ink-muted hover:bg-navy-100',
            )}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <EmptyState title="No inquiries yet." body="Submissions from the contact and get-involved forms will appear here." />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[820px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Type</th>
                <th className={th}>Name</th>
                <th className={th}>Email</th>
                <th className={th}>Submitted</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className={tr}>
                  <td className={td}>{INQUIRY_TYPE_LABELS[inquiry.type]}</td>
                  <td className={td}>{inquiry.name}</td>
                  <td className={td}>{inquiry.email}</td>
                  <td className={td}>{formatDate(inquiry.createdAt)}</td>
                  <td className={td}>
                    <Badge tone={STATUS_TONE[inquiry.status]}>{inquiry.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className={td}>
                    <Link href={`/admin/inquiries/${inquiry.id}`} className="text-brand-primary underline-offset-4 hover:underline">View</Link>
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
