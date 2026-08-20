import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateForm, deleteForm } from '@/lib/actions/admin/forms'
import { PageHeader, SubmitButton } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { FormBuilder } from '@/components/admin/forms/FormBuilder'
import type { FormFieldConfig } from '@/lib/forms'

export default async function EditFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const form = await prisma.formDefinition.findUnique({
    where: { id },
    include: { _count: { select: { events: true, cohorts: true } } },
  })

  if (!form) notFound()

  const fields = Array.isArray(form.fields) ? (form.fields as unknown as FormFieldConfig[]) : []
  const attached = form._count.events > 0 || form._count.cohorts > 0

  return (
    <div>
      <PageHeader
        title={form.name}
        description={`Used by ${form._count.events} event(s) and ${form._count.cohorts} cohort(s).`}
      />
      <SavedBanner saved={saved === '1'} />

      <FormBuilder action={updateForm.bind(null, form.id)} form={form} initialFields={fields} />

      <div className="mt-8 max-w-3xl">
        {attached ? (
          <p className="border border-dashed border-border-strong p-4 font-sans text-sm text-ink-muted">
            This form can&rsquo;t be deleted while it&rsquo;s attached to {form._count.events} event(s) or{' '}
            {form._count.cohorts} cohort(s). Detach it from those first.
          </p>
        ) : (
          <form action={deleteForm.bind(null, form.id)}>
            <SubmitButton variant="danger">Delete Form</SubmitButton>
          </form>
        )}
      </div>
    </div>
  )
}
