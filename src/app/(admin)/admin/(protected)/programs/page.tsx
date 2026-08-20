import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'

const STATUS_TONE: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
  OPEN_FOR_APPLICATIONS: 'success',
  ONGOING: 'default',
  CLOSED: 'warning',
  ARCHIVED: 'muted',
}

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Programs"
        description="Every program pathway on the public site is one of these records."
        actions={<PrimaryLinkButton href="/admin/programs/new">Create Program</PrimaryLinkButton>}
      />

      {programs.length === 0 ? (
        <EmptyState
          title="No programs have been created yet."
          body="Create a program to open it for applications and publish it on the public site."
          actionLabel="Create Program"
          actionHref="/admin/programs/new"
        />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[720px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Title</th>
                <th className={th}>Pillars</th>
                <th className={th}>Applications</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className={tr}>
                  <td className={td}>{program.title}</td>
                  <td className={td}>{program.pillarTags.length > 0 ? program.pillarTags.join(', ') : '—'}</td>
                  <td className={td}>{program._count.applications}</td>
                  <td className={td}>
                    <Badge tone={STATUS_TONE[program.status] ?? 'default'}>{program.status.replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className={td}>
                    <Link href={`/admin/programs/${program.id}`} className="text-brand-primary underline-offset-4 hover:underline">
                      Edit
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
