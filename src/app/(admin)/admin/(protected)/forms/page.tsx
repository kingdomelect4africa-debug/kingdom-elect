import Link from 'next/link'
import { prisma } from '@/lib/db'
import { publicOrigin } from '@/lib/site'
import { PageHeader, PrimaryLinkButton, Badge, th, td, tr } from '@/components/admin/ui'
import { ACCESS_TIERS, TIER_PATHS, tierFormName, tierQuestionList } from '@/lib/situation-room-tiers'
import type { FormFieldConfig } from '@/lib/forms'

const linkClasses = 'text-brand-primary underline-offset-4 hover:underline'

export default async function AdminFormsPage() {
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
              {/* The VVIP and VIP forms have their own designs, so their
                  questions live in code; they're listed here so every form
                  and its link is in one place. */}
              {ACCESS_TIERS.map((tier) => (
                <tr key={tier} className={tr}>
                  <td className={td}>
                    <span className="mr-2">{tierFormName(tier)}</span>
                    <Badge tone="muted">Built-in</Badge>
                  </td>
                  <td className={td}>{tierQuestionList(tier).length}</td>
                  <td className={td}>1</td>
                  <td className={td}>0</td>
                  <td className={td}>
                    <a href={`${origin}${TIER_PATHS[tier]}`} target="_blank" rel="noreferrer" className={linkClasses}>
                      {TIER_PATHS[tier]} ↗
                    </a>
                  </td>
                  <td className={td}>
                    <Link href={`/admin/forms/built-in/${tier.toLowerCase()}`} className={linkClasses}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {forms.map((form) => {
                const fieldCount = Array.isArray(form.fields) ? (form.fields as unknown as FormFieldConfig[]).length : 0
                return (
                  <tr key={form.id} className={tr}>
                    <td className={td}>{form.name}</td>
                    <td className={td}>{fieldCount}</td>
                    <td className={td}>{form._count.events}</td>
                    <td className={td}>{form._count.programs}</td>
                    <td className={td}>
                      <a href={`${origin}/forms/${form.slug}`} target="_blank" rel="noreferrer" className={linkClasses}>
                        /forms/{form.slug} ↗
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
              {forms.length === 0 && (
                <tr>
                  <td colSpan={6} className={`${td} text-ink-muted`}>
                    No custom forms yet. <Link href="/admin/forms/new" className={linkClasses}>Create one</Link> and attach it to an event or program.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </div>
  )
}
