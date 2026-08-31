import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { cn } from '@/lib/cn'
import type { Article, ArticleAuthor, Event, Person, PillarTag, Program } from '@prisma/client'

const CATEGORY_OPTIONS = [
  'RESEARCH',
  'POLICY',
  'GOVERNANCE',
  'LEADERSHIP',
  'ECONOMY',
  'TECHNOLOGY',
  'EDUCATION',
  'CULTURE',
  'INNOVATION',
  'TERRITORIES',
]

const PILLAR_OPTIONS: PillarTag[] = ['EDUCATOR', 'LEADER', 'ENTREPRENEUR', 'CREATIVE', 'TECHNOCRAT']

const STATUS_OPTIONS = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED']

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

export function ArticleForm({
  action,
  article,
  people,
  programs,
  events,
  allowPublish,
}: {
  action: (formData: FormData) => Promise<void>
  article?: Article & { authors: Pick<ArticleAuthor, 'personId'>[] }
  people: Pick<Person, 'id' | 'firstName' | 'lastName'>[]
  programs: Pick<Program, 'id' | 'title'>[]
  events: Pick<Event, 'id' | 'title'>[]
  allowPublish: boolean
}) {
  const selectedAuthorIds = article?.authors.map((a) => a.personId) ?? []

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Details</legend>
        <Field label="Title" htmlFor="title" required>
          <input id="title" name="title" required defaultValue={article?.title} className={inputClasses} />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <input id="slug" name="slug" defaultValue={article?.slug} className={inputClasses} />
        </Field>
        <Field label="Subtitle" htmlFor="subtitle">
          <input id="subtitle" name="subtitle" defaultValue={article?.subtitle ?? ''} className={inputClasses} />
        </Field>
        <Field label="Category" htmlFor="category" required>
          <select id="category" name="category" required defaultValue={article?.category ?? 'RESEARCH'} className={inputClasses}>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        </Field>
        <Field label="Excerpt" htmlFor="excerpt" required hint="Short teaser shown on the Kingdom Intelligence index.">
          <textarea id="excerpt" name="excerpt" required defaultValue={article?.excerpt} rows={2} className={inputClasses} />
        </Field>
        <Field label="Body" htmlFor="body" required>
          <textarea id="body" name="body" required defaultValue={article?.body} rows={12} className={inputClasses} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Authorship &amp; Tags</legend>
        <Field label="Authors" htmlFor="authorIds" hint="Hold Cmd/Ctrl (or Shift) to select multiple people from People.">
          <select
            id="authorIds"
            name="authorIds"
            multiple
            size={Math.min(8, Math.max(4, people.length))}
            defaultValue={selectedAuthorIds}
            className={cn(inputClasses, 'h-auto')}
          >
            {people.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
        </Field>
        <Field label="Pillar Tags" htmlFor="pillarTags">
          <div className="flex flex-wrap gap-4">
            {PILLAR_OPTIONS.map((p) => (
              <label key={p} className="flex items-center gap-2 font-sans text-sm text-ink">
                <input type="checkbox" name="pillarTags" value={p} defaultChecked={article?.pillarTags.includes(p)} className="h-4 w-4" />
                {p}
              </label>
            ))}
          </div>
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Relations &amp; Publishing</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Related Program" htmlFor="relatedProgramId">
            <select id="relatedProgramId" name="relatedProgramId" defaultValue={article?.relatedProgramId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </Field>
          <Field label="Related Event" htmlFor="relatedEventId">
            <select id="relatedEventId" name="relatedEventId" defaultValue={article?.relatedEventId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Published Date" htmlFor="publishedDate">
            <input id="publishedDate" name="publishedDate" type="date" defaultValue={toDateInputValue(article?.publishedDate)} className={inputClasses} />
          </Field>
          <Field
            label="Status"
            htmlFor="status"
            required
            hint={!allowPublish ? 'You can submit for review — a Content Editor will publish.' : undefined}
          >
            <select id="status" name="status" required defaultValue={article?.status ?? 'DRAFT'} className={inputClasses}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} disabled={s === 'PUBLISHED' && !allowPublish}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 font-sans text-sm text-ink">
          <input type="checkbox" name="featuredOnHomepage" defaultChecked={article?.featuredOnHomepage} className="h-4 w-4" />
          Feature on homepage
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">SEO</legend>
        <Field label="SEO Title" htmlFor="seoTitle">
          <input id="seoTitle" name="seoTitle" defaultValue={article?.seoTitle ?? ''} className={inputClasses} />
        </Field>
        <Field label="SEO Description" htmlFor="seoDescription">
          <textarea id="seoDescription" name="seoDescription" defaultValue={article?.seoDescription ?? ''} rows={2} className={inputClasses} />
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{article ? 'Save Article' : 'Create Article'}</SubmitButton>
      </div>
    </form>
  )
}
