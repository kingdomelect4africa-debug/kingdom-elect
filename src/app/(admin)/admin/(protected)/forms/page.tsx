import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PageHeader, PrimaryLinkButton, EmptyState, th, td, tr } from '@/components/admin/ui'
import type { FormFieldConfig } from '@/lib/forms'

export default async function AdminFormsPage() {
  const forms = await prisma.formDefinition.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { events: true, cohorts: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Form Builder"
        description="Reusable registration and application forms attached to Events and Program Cohorts."
        actions={<PrimaryLinkButton href="/admin/forms/new">Create Form</PrimaryLinkButton>}
      />

      {forms.length === 0 ? (
        <EmptyState
          title="No forms yet."
          body="Build a form here, then attach it to an event or program cohort."
          actionLabel="Create Form"
          actionHref="/admin/forms/new"
        />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[720px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Fields</th>
                <th className={th}>Events</th>
                <th className={th}>Cohorts</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => {
                const fieldCount = Array.isArray(form.fields) ? (form.fields as unknown as FormFieldConfig[]).length : 0
                return (
                  <tr key={form.id} className={tr}>
                    <td className={td}>{form.name}</td>
                    <td className={td}>{fieldCount}</td>
                    <td className={td}>{form._count.events}</td>
                    <td className={td}>{form._count.cohorts}</td>
                    <td className={td}>
                      <Link href={`/admin/forms/${form.id}`} className="text-brand-primary underline-offset-4 hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
