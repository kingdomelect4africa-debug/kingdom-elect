import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import type { Organization, OrganizationType, Person } from '@prisma/client'

const TYPE_OPTIONS: OrganizationType[] = ['CHURCH_MINISTRY', 'CORPORATE', 'NGO', 'GOVERNMENT', 'MEDIA', 'ACADEMIC']

export function OrganizationForm({
  action,
  organization,
  people,
}: {
  action: (formData: FormData) => Promise<void>
  organization?: Organization
  people: Pick<Person, 'id' | 'firstName' | 'lastName'>[]
}) {
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Details</legend>
        <Field label="Name" htmlFor="name" required>
          <input id="name" name="name" required defaultValue={organization?.name} className={inputClasses} />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the name.">
          <input id="slug" name="slug" defaultValue={organization?.slug} className={inputClasses} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Type" htmlFor="type" required>
            <select id="type" name="type" required defaultValue={organization?.type ?? 'CORPORATE'} className={inputClasses}>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>
          <Field label="Country" htmlFor="country">
            <input id="country" name="country" defaultValue={organization?.country ?? ''} className={inputClasses} />
          </Field>
        </div>
        <Field label="Website" htmlFor="website">
          <input id="website" name="website" defaultValue={organization?.website ?? ''} className={inputClasses} placeholder="https://" />
        </Field>
        <Field label="Description" htmlFor="description">
          <textarea id="description" name="description" defaultValue={organization?.description ?? ''} rows={4} className={inputClasses} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Contact &amp; Partnership</legend>
        <Field label="Primary Contact" htmlFor="primaryContactId" hint="Optional — the Person who represents this organization.">
          <select id="primaryContactId" name="primaryContactId" defaultValue={organization?.primaryContactId ?? ''} className={inputClasses}>
            <option value="">None</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
        </Field>
        <Field label="Partnership Tier" htmlFor="partnershipTier" hint="Free text, e.g. Strategic, Founding, Community.">
          <input id="partnershipTier" name="partnershipTier" defaultValue={organization?.partnershipTier ?? ''} className={inputClasses} />
        </Field>
        <label className="flex items-center gap-2 font-sans text-sm text-ink">
          <input type="checkbox" name="featuredOnHomepage" defaultChecked={organization?.featuredOnHomepage} className="h-4 w-4" />
          Feature on homepage
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">SEO</legend>
        <Field label="SEO Title" htmlFor="seoTitle">
          <input id="seoTitle" name="seoTitle" defaultValue={organization?.seoTitle ?? ''} className={inputClasses} />
        </Field>
        <Field label="SEO Description" htmlFor="seoDescription">
          <textarea id="seoDescription" name="seoDescription" defaultValue={organization?.seoDescription ?? ''} rows={2} className={inputClasses} />
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{organization ? 'Save Partner' : 'Create Partner'}</SubmitButton>
      </div>
    </form>
  )
}
