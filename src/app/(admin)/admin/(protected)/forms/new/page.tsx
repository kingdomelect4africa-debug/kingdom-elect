import { createForm } from '@/lib/actions/admin/forms'
import { PageHeader } from '@/components/admin/ui'
import { FormBuilder } from '@/components/admin/forms/FormBuilder'

export default function NewFormPage() {
  return (
    <div>
      <PageHeader title="Create Form" description="Fields you add here become the registration or application form a visitor fills out." />
      <FormBuilder action={createForm} initialFields={[]} />
    </div>
  )
}
