import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { canViewFinancialValue } from '@/lib/rbac'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'

const STATUS_TONE: Record<string, 'default' | 'success' | 'muted'> = { ACTIVE: 'success', PENDING: 'default', ENDED: 'muted' }

export default async function AdminPartnershipsPage() {
  const user = await getCurrentUser()
  const showValue = !!user && canViewFinancialValue(user)

  const partnerships = await prisma.partnership.findMany({
    orderBy: { createdAt: 'desc' },
    include: { organization: { select: { name: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Partnerships"
        description="Formal engagements with partner organizations — strategic, financial, media, chapter, or in-kind."
        actions={<PrimaryLinkButton href="/admin/partnerships/new">Create Partnership</PrimaryLinkButton>}
      />

      {partnerships.length === 0 ? (
        <EmptyState title="No partnerships yet." body="Create the first partnership record to track it here." actionLabel="Create Partnership" actionHref="/admin/partnerships/new" />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[680px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Organization</th>
                <th className={th}>Type</th>
                <th className={th}>Status</th>
                {showValue && <th className={th}>Value</th>}
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {partnerships.map((p) => (
                <tr key={p.id} className={tr}>
                  <td className={td}>{p.organization.name}</td>
                  <td className={td}>{p.type.replace(/_/g, ' ')}</td>
                  <td className={td}><Badge tone={STATUS_TONE[p.status] ?? 'default'}>{p.status}</Badge></td>
                  {showValue && <td className={td}>{p.value ?? '—'}</td>}
                  <td className={td}><Link href={`/admin/partnerships/${p.id}`} className="text-brand-primary underline-offset-4 hover:underline">Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
