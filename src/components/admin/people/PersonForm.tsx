import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import type { Chapter, Organization, Person, PersonStatus, PillarTag } from '@prisma/client'

const PILLAR_OPTIONS: PillarTag[] = ['EDUCATOR', 'LEADER', 'ENTREPRENEUR', 'CREATIVE', 'TECHNOCRAT']
const STATUS_OPTIONS: PersonStatus[] = ['ACTIVE', 'INACTIVE']

export function PersonForm({
  action,
  person,
  organizations,
  chapters,
  lockedChapter,
}: {
  action: (formData: FormData) => Promise<void>
  person?: Person
  organizations: Pick<Organization, 'id' | 'name'>[]
  chapters: Pick<Chapter, 'id' | 'name'>[]
  /** Set when the acting user is a Chapter Administrator — home chapter cannot be changed. */
  lockedChapter?: Pick<Chapter, 'id' | 'name'>
}) {
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Identity</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First Name" htmlFor="firstName" required>
            <input id="firstName" name="firstName" required defaultValue={person?.firstName} className={inputClasses} />
          </Field>
          <Field label="Last Name" htmlFor="lastName" required>
            <input id="lastName" name="lastName" required defaultValue={person?.lastName} className={inputClasses} />
          </Field>
        </div>
        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the name.">
          <input id="slug" name="slug" defaultValue={person?.slug} className={inputClasses} />
        </Field>
        <Field label="Title" htmlFor="title" hint="e.g. Founder & CEO, Youth Pastor, Software Engineer.">
          <input id="title" name="title" defaultValue={person?.title ?? ''} className={inputClasses} />
        </Field>
        <Field label="Bio" htmlFor="bio">
          <textarea id="bio" name="bio" defaultValue={person?.bio ?? ''} rows={5} className={inputClasses} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Affiliation &amp; Location</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Organization" htmlFor="organizationId" hint="Optional — the institution this person is associated with.">
            <select id="organizationId" name="organizationId" defaultValue={person?.organizationId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </Field>
          <Field label="Country" htmlFor="country">
            <input id="country" name="country" defaultValue={person?.country ?? ''} className={inputClasses} />
          </Field>
        </div>
        {lockedChapter ? (
          <Field label="Home Chapter" htmlFor="homeChapterId-display" hint="You can only manage people within your own chapter.">
            <input id="homeChapterId-display" disabled value={lockedChapter.name} className={inputClasses} />
            <input type="hidden" name="homeChapterId" value={lockedChapter.id} />
          </Field>
        ) : (
          <Field label="Home Chapter" htmlFor="homeChapterId" hint="Optional — the chapter this person is based in.">
            <select id="homeChapterId" name="homeChapterId" defaultValue={person?.homeChapterId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        )}
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
                defaultChecked={person?.pillarTags?.includes(tag)}
                className="h-4 w-4"
              />
              {tag}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Contact &amp; Publishing</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="email" hint="Must be unique across all people.">
            <input id="email" name="email" type="email" defaultValue={person?.email ?? ''} className={inputClasses} />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <input id="phone" name="phone" defaultValue={person?.phone ?? ''} className={inputClasses} />
          </Field>
        </div>
        <label className="flex items-center gap-2 font-sans text-sm text-ink">
          <input type="checkbox" name="consentToPublish" defaultChecked={person?.consentToPublish} className="h-4 w-4" />
          This person has consented to their name, photo, and story being published publicly.
        </label>
        <Field label="Status" htmlFor="status" required>
          <select id="status" name="status" required defaultValue={person?.status ?? 'ACTIVE'} className={inputClasses}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{person ? 'Save Person' : 'Create Person'}</SubmitButton>
      </div>
    </form>
  )
}
