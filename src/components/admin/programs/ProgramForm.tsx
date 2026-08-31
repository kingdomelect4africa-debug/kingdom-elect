import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import type { PillarTag, Program, ProgramStatus, User } from '@prisma/client'

const STATUS_OPTIONS: ProgramStatus[] = ['OPEN_FOR_APPLICATIONS', 'ONGOING', 'CLOSED', 'ARCHIVED']
const PILLAR_OPTIONS: PillarTag[] = ['EDUCATOR', 'LEADER', 'ENTREPRENEUR', 'CREATIVE', 'TECHNOCRAT']

export function ProgramForm({
  action,
  program,
  programManagers,
}: {
  action: (formData: FormData) => Promise<void>
  program?: Program
  programManagers: Pick<User, 'id' | 'name'>[]
}) {
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Details</legend>
        <Field label="Title" htmlFor="title" required>
          <input id="title" name="title" required defaultValue={program?.title} className={inputClasses} />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <input id="slug" name="slug" defaultValue={program?.slug} className={inputClasses} />
        </Field>
        <Field label="Summary" htmlFor="summary" required>
          <textarea id="summary" name="summary" required defaultValue={program?.summary} rows={2} className={inputClasses} />
        </Field>
        <Field label="Description" htmlFor="description" required>
          <textarea id="description" name="description" required defaultValue={program?.description} rows={6} className={inputClasses} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Pillars</legend>
        <div className="flex flex-wrap gap-5">
          {PILLAR_OPTIONS.map((tag) => (
            <label key={tag} className="flex items-center gap-2 font-sans text-sm text-ink">
              <input
                type="checkbox"
                name="pillarTags"
                value={tag}
                defaultChecked={program?.pillarTags?.includes(tag)}
                className="h-4 w-4"
              />
              {tag}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Management &amp; Status</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status" htmlFor="status" required>
            <select id="status" name="status" required defaultValue={program?.status ?? 'ONGOING'} className={inputClasses}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>
          <Field label="Program Manager" htmlFor="programManagerId" hint="Optional — must have the Program Manager or Super Admin role.">
            <select id="programManagerId" name="programManagerId" defaultValue={program?.programManagerId ?? ''} className={inputClasses}>
              <option value="">Unassigned</option>
              {programManagers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 font-sans text-sm text-ink">
          <input type="checkbox" name="featuredOnHomepage" defaultChecked={program?.featuredOnHomepage} className="h-4 w-4" />
          Feature on homepage
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">SEO</legend>
        <Field label="SEO Title" htmlFor="seoTitle">
          <input id="seoTitle" name="seoTitle" defaultValue={program?.seoTitle ?? ''} className={inputClasses} />
        </Field>
        <Field label="SEO Description" htmlFor="seoDescription">
          <textarea id="seoDescription" name="seoDescription" defaultValue={program?.seoDescription ?? ''} rows={2} className={inputClasses} />
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{program ? 'Save Program' : 'Create Program'}</SubmitButton>
      </div>
    </form>
  )
}
