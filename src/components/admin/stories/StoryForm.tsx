import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import type { Chapter, Event, Person, Program, Story } from '@prisma/client'

const STATUS_OPTIONS = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED']

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

export function StoryForm({
  action,
  story,
  people,
  chapters,
  programs,
  events,
}: {
  action: (formData: FormData) => Promise<void>
  story?: Story
  people: Pick<Person, 'id' | 'firstName' | 'lastName'>[]
  chapters: Pick<Chapter, 'id' | 'name'>[]
  programs: Pick<Program, 'id' | 'title'>[]
  events: Pick<Event, 'id' | 'title'>[]
}) {
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Details</legend>
        <Field label="Title" htmlFor="title" required>
          <input id="title" name="title" required defaultValue={story?.title} className={inputClasses} />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <input id="slug" name="slug" defaultValue={story?.slug} className={inputClasses} />
        </Field>
        <Field label="Featured Person" htmlFor="personFeaturedId" required hint="Don't see the person? Add them to People first.">
          <select id="personFeaturedId" name="personFeaturedId" required defaultValue={story?.personFeaturedId ?? ''} className={inputClasses}>
            <option value="" disabled>Select a person</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
        </Field>
        <Field label="Summary" htmlFor="summary" required>
          <textarea id="summary" name="summary" required defaultValue={story?.summary} rows={2} className={inputClasses} />
        </Field>
        <Field label="Body" htmlFor="body" required>
          <textarea id="body" name="body" required defaultValue={story?.body} rows={10} className={inputClasses} />
        </Field>
        <Field label="Video URL" htmlFor="videoUrl">
          <input id="videoUrl" name="videoUrl" defaultValue={story?.videoUrl ?? ''} className={inputClasses} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Relations</legend>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Related Chapter" htmlFor="relatedChapterId">
            <select id="relatedChapterId" name="relatedChapterId" defaultValue={story?.relatedChapterId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Related Program" htmlFor="relatedProgramId">
            <select id="relatedProgramId" name="relatedProgramId" defaultValue={story?.relatedProgramId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Related Event" htmlFor="relatedEventId">
          <select id="relatedEventId" name="relatedEventId" defaultValue={story?.relatedEventId ?? ''} className={inputClasses}>
            <option value="">None</option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Publishing</legend>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Published Date" htmlFor="publishedDate">
            <input id="publishedDate" name="publishedDate" type="date" defaultValue={toDateInputValue(story?.publishedDate)} className={inputClasses} />
          </Field>
          <Field label="Status" htmlFor="status" required>
            <select id="status" name="status" required defaultValue={story?.status ?? 'DRAFT'} className={inputClasses}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 font-sans text-sm text-ink">
          <input type="checkbox" name="featuredOnHomepage" defaultChecked={story?.featuredOnHomepage} className="h-4 w-4" />
          Feature on homepage
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">SEO</legend>
        <Field label="SEO Title" htmlFor="seoTitle">
          <input id="seoTitle" name="seoTitle" defaultValue={story?.seoTitle ?? ''} className={inputClasses} />
        </Field>
        <Field label="SEO Description" htmlFor="seoDescription">
          <textarea id="seoDescription" name="seoDescription" defaultValue={story?.seoDescription ?? ''} rows={2} className={inputClasses} />
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{story ? 'Save Story' : 'Create Story'}</SubmitButton>
      </div>
    </form>
  )
}
