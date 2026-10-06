import { createForm } from '@/lib/actions/admin/forms'
import { requireUser } from '@/lib/auth'
import { loadAttachTargets } from '@/lib/form-attachments'
import { PageHeader } from '@/components/admin/ui'
import { FormBuilder } from '@/components/admin/forms/FormBuilder'

export default async function NewFormPage() {
  const user = await requireUser()
  const { events, programs } = await loadAttachTargets(user)

  return (
    <div>
      <PageHeader title="Create Form" description="Fields you add here become the registration or application form a visitor fills out." />
      <FormBuilder action={createForm} initialFields={[]} events={events} programs={programs} />
    </div>
  )
}
