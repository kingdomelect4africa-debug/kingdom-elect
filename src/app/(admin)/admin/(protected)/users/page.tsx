import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { ROLE_LABELS } from '@/lib/rbac'
import { deactivateUser, reactivateUser } from '@/lib/actions/admin/users'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const { saved } = await searchParams
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    include: { chapter: { select: { name: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Users"
        description="Staff accounts and role assignments for the admin CMS."
        actions={<PrimaryLinkButton href="/admin/users/new">Create User</PrimaryLinkButton>}
      />
      <SavedBanner saved={saved === '1'} />

      {users.length === 0 ? (
        <EmptyState title="No staff accounts yet." body="Create a user to grant access to the admin CMS." actionLabel="Create User" actionHref="/admin/users/new" />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[720px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Email</th>
                <th className={th}>Role</th>
                <th className={th}>Chapter</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={tr}>
                  <td className={td}>{user.name}</td>
                  <td className={td}>{user.email}</td>
                  <td className={td}>{ROLE_LABELS[user.role]}</td>
                  <td className={td}>{user.chapter?.name ?? '—'}</td>
                  <td className={td}>
                    <Badge tone={user.active ? 'success' : 'muted'}>{user.active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className={td}>
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/users/${user.id}`} className="text-brand-primary underline-offset-4 hover:underline">Edit</Link>
                      <form action={(user.active ? deactivateUser : reactivateUser).bind(null, user.id)}>
                        <button type="submit" className="font-sans text-xs uppercase text-ink-muted hover:underline">
                          {user.active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      </form>
                    </div>
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
