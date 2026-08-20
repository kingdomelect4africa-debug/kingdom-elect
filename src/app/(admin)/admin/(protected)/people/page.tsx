import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { chapterScopeWhere } from '@/lib/rbac'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'

const STATUS_TONE: Record<string, 'default' | 'success' | 'muted'> = { ACTIVE: 'success', INACTIVE: 'muted' }

export default async function AdminPeoplePage() {
  const user = await getCurrentUser()
  const scope = user ? chapterScopeWhere(user) : {}
  const where = 'chapterId' in scope ? { homeChapterId: scope.chapterId } : {}

  const people = await prisma.person.findMany({
    where,
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    include: {
      organization: { select: { name: true } },
      homeChapter: { select: { name: true } },
    },
  })

  return (
    <div>
      <PageHeader
        title="People"
        description="Every human being on the platform has exactly one record here — memberships, fellowships, speaking slots, and applications all point back to this one row."
        actions={<PrimaryLinkButton href="/admin/people/new">Add Person</PrimaryLinkButton>}
      />

      {people.length === 0 ? (
        <EmptyState title="No people yet." body="Add the first person to start building the Kingdom E.L.E.C.T. network." actionLabel="Add Person" actionHref="/admin/people/new" />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[860px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Title / Organization</th>
                <th className={th}>Chapter</th>
                <th className={th}>Pillars</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id} className={tr}>
                  <td className={td}>{person.firstName} {person.lastName}</td>
                  <td className={td}>
                    {person.title && <span>{person.title}</span>}
                    {person.title && person.organization && <span className="text-ink-muted"> · </span>}
                    {person.organization?.name}
                  </td>
                  <td className={td}>{person.homeChapter?.name ?? '—'}</td>
                  <td className={td}>
                    <div className="flex flex-wrap gap-1.5">
                      {person.pillarTags.map((tag) => <Badge key={tag} tone="default">{tag}</Badge>)}
                    </div>
                  </td>
                  <td className={td}><Badge tone={STATUS_TONE[person.status] ?? 'default'}>{person.status}</Badge></td>
                  <td className={td}><Link href={`/admin/people/${person.id}`} className="text-brand-primary underline-offset-4 hover:underline">Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
