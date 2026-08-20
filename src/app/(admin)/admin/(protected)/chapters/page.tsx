import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'

const STATUS_TONE: Record<string, 'default' | 'success' | 'warning'> = { ACTIVE: 'success', FORMING: 'warning', PLANNED: 'default' }

export default async function AdminChaptersPage() {
  const user = await getCurrentUser()

  const chapters = await prisma.chapter.findMany({
    orderBy: [{ country: 'asc' }, { name: 'asc' }],
    include: {
      leadPerson: { select: { firstName: true, lastName: true } },
      _count: { select: { members: true } },
    },
  })

  return (
    <div>
      <PageHeader
        title="Chapters"
        description="Continental and national chapters. Opening a new chapter is a Super Admin decision."
        actions={user?.role === 'SUPER_ADMIN' ? <PrimaryLinkButton href="/admin/chapters/new">Create Chapter</PrimaryLinkButton> : undefined}
      />

      {chapters.length === 0 ? (
        <EmptyState title="No chapters yet." body="Super Admins can open the first chapter." actionLabel={user?.role === 'SUPER_ADMIN' ? 'Create Chapter' : undefined} actionHref={user?.role === 'SUPER_ADMIN' ? '/admin/chapters/new' : undefined} />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[760px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Country</th>
                <th className={th}>Lead</th>
                <th className={th}>Members</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter) => (
                <tr key={chapter.id} className={tr}>
                  <td className={td}>{chapter.name}</td>
                  <td className={td}>{chapter.country}</td>
                  <td className={td}>{chapter.leadPerson ? `${chapter.leadPerson.firstName} ${chapter.leadPerson.lastName}` : '—'}</td>
                  <td className={td}>{chapter._count.members}</td>
                  <td className={td}><Badge tone={STATUS_TONE[chapter.status] ?? 'default'}>{chapter.status}</Badge></td>
                  <td className={td}><Link href={`/admin/chapters/${chapter.id}`} className="text-brand-primary underline-offset-4 hover:underline">Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
