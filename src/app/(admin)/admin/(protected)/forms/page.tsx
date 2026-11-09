import Link from 'next/link'
import { prisma } from '@/lib/db'
import { publicOrigin } from '@/lib/site'
import { PageHeader, PrimaryLinkButton, Badge, th, td, tr } from '@/components/admin/ui'
import { TIER_PATHS, isAccessTier } from '@/lib/situation-room-tiers'
import { ensureTierForms } from '@/lib/tier-forms'
import type { FormFieldConfig } from '@/lib/forms'

const linkClasses = 'text-brand-primary underline-offset-4 hover:underline'

export default async function AdminFormsPage() {
  // So the VVIP and VIP forms are listed even before anyone opens their pages.
  await ensureTierForms()
  const [forms, origin] = await Promise.all([
    prisma.formDefinition.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { events: true, programs: true } } },
    }),
    publicOrigin(),
  ])

  return (
    <div>
      <PageHeader
        title="Form Builder"
        description="Reusable registration and application forms attached to Events and Programs."
        actions={<PrimaryLinkButton href="/admin/forms/new">Create Form</PrimaryLinkButton>}
      />

      <div className="overflow-x-auto border border-border-subtle">
        <table className="w-full min-w-[720px]">
          <thead className="bg-navy-50">
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Fields</th>
              <th className={th}>Events</th>
              <th className={th}>Programs</th>
              <th className={th}>Link</th>
              <th className={th}></th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => {
              const fieldCount = Array.isArray(form.fields) ? (form.fields as unknown as FormFieldConfig[]).length : 0
              // The VVIP and VIP forms live on their own pages and register people for the Situation Room.
              const tier = isAccessTier(form.accessTier) ? form.accessTier : null
              const path = tier ? TIER_PATHS[tier] : `/forms/${form.slug}`
              return (
                <tr key={form.id} className={tr}>
                  <td className={td}>
                    <span className={tier ? 'mr-2' : undefined}>{form.name}</span>
                    {tier && <Badge tone="warning">{tier} page</Badge>}
                  </td>
                  <td className={td}>{fieldCount}</td>
                  <td className={td}>{tier ? 1 : form._count.events}</td>
                  <td className={td}>{form._count.programs}</td>
                  <td className={td}>
                    <a href={`${origin}${path}`} target="_blank" rel="noreferrer" className={linkClasses}>
                      {path} ↗
                    </a>
                  </td>
                  <td className={td}>
                    <Link href={`/admin/forms/${form.id}`} className={linkClasses}>
                      Edit
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
