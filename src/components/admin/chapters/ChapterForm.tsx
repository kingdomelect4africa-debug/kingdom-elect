import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import type { Chapter, ChapterStatus, Person } from '@prisma/client'

const STATUS_OPTIONS: ChapterStatus[] = ['ACTIVE', 'FORMING', 'PLANNED']

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

export function ChapterForm({
  action,
  chapter,
  people,
}: {
  action: (formData: FormData) => Promise<void>
  chapter?: Chapter
  people: Pick<Person, 'id' | 'firstName' | 'lastName'>[]
}) {
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Details</legend>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Country" htmlFor="country" required>
            <input id="country" name="country" required defaultValue={chapter?.country} className={inputClasses} />
          </Field>
          <Field label="Chapter Name" htmlFor="name" required>
            <input id="name" name="name" required defaultValue={chapter?.name} className={inputClasses} />
          </Field>
        </div>
        <Field label="Slug" htmlFor="slug" hint="Drives the public URL at /chapters/[slug]. Leave blank to generate from the name.">
          <input id="slug" name="slug" defaultValue={chapter?.slug} className={inputClasses} />
        </Field>
        <Field label="Chapter Lead" htmlFor="leadPersonId" hint="Optional — must already exist as a Person record.">
          <select id="leadPersonId" name="leadPersonId" defaultValue={chapter?.leadPersonId ?? ''} className={inputClasses}>
            <option value="">Unassigned</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
        </Field>
        <Field label="Description" htmlFor="description">
          <textarea id="description" name="description" defaultValue={chapter?.description ?? ''} rows={4} className={inputClasses} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Contact &amp; Status</legend>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact Email" htmlFor="contactEmail">
            <input id="contactEmail" name="contactEmail" type="email" defaultValue={chapter?.contactEmail ?? ''} className={inputClasses} />
          </Field>
          <Field label="Launch Date" htmlFor="launchDate">
            <input id="launchDate" name="launchDate" type="date" defaultValue={toDateInputValue(chapter?.launchDate)} className={inputClasses} />
          </Field>
        </div>
        <Field label="Status" htmlFor="status" required>
          <select id="status" name="status" required defaultValue={chapter?.status ?? 'PLANNED'} className={inputClasses}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">SEO</legend>
        <Field label="SEO Title" htmlFor="seoTitle">
          <input id="seoTitle" name="seoTitle" defaultValue={chapter?.seoTitle ?? ''} className={inputClasses} />
        </Field>
        <Field label="SEO Description" htmlFor="seoDescription">
          <textarea id="seoDescription" name="seoDescription" defaultValue={chapter?.seoDescription ?? ''} rows={2} className={inputClasses} />
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{chapter ? 'Save Chapter' : 'Create Chapter'}</SubmitButton>
      </div>
    </form>
  )
}
