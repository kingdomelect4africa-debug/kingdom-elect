import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'

const TYPE_LABELS: Record<string, string> = {
  CHURCH_MINISTRY: 'Church & Ministry', CORPORATE: 'Corporate', NGO: 'NGO',
  GOVERNMENT: 'Government', MEDIA: 'Media', ACADEMIC: 'Academic',
}

export default async function AdminOrganizationsPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <PageHeader
        title="Partners"
        description="Institutional partners — organizations, not people. A partner's staff are Person records linked here as primary contacts."
        actions={<PrimaryLinkButton href="/admin/organizations/new">Add Partner</PrimaryLinkButton>}
      />

      {organizations.length === 0 ? (
        <EmptyState title="No partners yet." body="Add the first institutional partner to see it appear on the public Partners page." actionLabel="Add Partner" actionHref="/admin/organizations/new" />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[720px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Type</th>
                <th className={th}>Country</th>
                <th className={th}>Featured</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className={tr}>
                  <td className={td}>{org.name}</td>
                  <td className={td}>{TYPE_LABELS[org.type] ?? org.type}</td>
                  <td className={td}>{org.country ?? '—'}</td>
                  <td className={td}>{org.featuredOnHomepage ? <Badge tone="success">Featured</Badge> : <Badge tone="muted">No</Badge>}</td>
                  <td className={td}><Link href={`/admin/organizations/${org.id}`} className="text-brand-primary underline-offset-4 hover:underline">Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
