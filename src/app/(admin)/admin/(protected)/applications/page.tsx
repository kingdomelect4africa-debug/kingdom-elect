import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PageHeader, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'
import { formatDate } from '@/lib/format'

const STATUS_TONE: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
  SUBMITTED: 'default',
  UNDER_REVIEW: 'warning',
  SHORTLISTED: 'warning',
  ACCEPTED: 'success',
  ENROLLED: 'success',
  REJECTED: 'muted',
  WITHDRAWN: 'muted',
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>
}) {
  const { program: programId } = await searchParams

  const [applications, filteredProgram] = await Promise.all([
    prisma.application.findMany({
      where: programId ? { programId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { person: { select: { firstName: true, lastName: true } }, program: { select: { title: true } } },
    }),
    programId ? prisma.program.findUnique({ where: { id: programId }, select: { title: true } }) : null,
  ])

  return (
    <div>
      <PageHeader
        title="Applications"
        description={
          filteredProgram
            ? `Showing applications to ${filteredProgram.title} only. `
            : 'Every program application submitted on the public site is one of these records.'
        }
        actions={
          filteredProgram ? (
            <Link href="/admin/applications" className="font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline" style={{ letterSpacing: '0.06em' }}>
              Clear Filter
            </Link>
          ) : undefined
        }
      />

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet."
          body="Applications will appear here once candidates start applying to your programs."
        />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[720px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Applicant</th>
                <th className={th}>Program</th>
                <th className={th}>Submitted</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className={tr}>
                  <td className={td}>{application.person.firstName} {application.person.lastName}</td>
                  <td className={td}>{application.program.title}</td>
                  <td className={td}>{formatDate(application.createdAt)}</td>
                  <td className={td}>
                    <Badge tone={STATUS_TONE[application.status] ?? 'default'}>{application.status.replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className={td}>
                    <Link href={`/admin/applications/${application.id}`} className="text-brand-primary underline-offset-4 hover:underline">
                      Review
                    </Link>
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
