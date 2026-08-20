import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import type { Event, FormDefinition, Chapter } from '@prisma/client'

const TYPE_OPTIONS = ['SITUATION_ROOM', 'REGIONAL_SUMMIT', 'CHAPTER_MEETUP', 'WEBINAR', 'TRAINING']
const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
const REG_STATUS_OPTIONS = ['OPEN', 'WAITLIST', 'CLOSED']

function toDateTimeLocal(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 16)
}

export function EventForm({
  action,
  event,
  forms,
  chapters,
}: {
  action: (formData: FormData) => Promise<void>
  event?: Event
  forms: Pick<FormDefinition, 'id' | 'name'>[]
  chapters: Pick<Chapter, 'id' | 'name'>[]
}) {
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Details</legend>
        <Field label="Title" htmlFor="title" required>
          <input id="title" name="title" required defaultValue={event?.title} className={inputClasses} />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <input id="slug" name="slug" defaultValue={event?.slug} className={inputClasses} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type" htmlFor="type" required>
            <select id="type" name="type" required defaultValue={event?.type ?? 'SITUATION_ROOM'} className={inputClasses}>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>
          <Field label="Chapter (optional — blank for continental)" htmlFor="chapterId">
            <select id="chapterId" name="chapterId" defaultValue={event?.chapterId ?? ''} className={inputClasses}>
              <option value="">None (Continental)</option>
              {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Summary" htmlFor="summary" required>
          <textarea id="summary" name="summary" required defaultValue={event?.summary} rows={2} className={inputClasses} />
        </Field>
        <Field label="Description" htmlFor="description" required>
          <textarea id="description" name="description" required defaultValue={event?.description} rows={5} className={inputClasses} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">When &amp; Where</legend>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start" htmlFor="startDate" required>
            <input id="startDate" name="startDate" type="datetime-local" required defaultValue={toDateTimeLocal(event?.startDate)} className={inputClasses} />
          </Field>
          <Field label="End" htmlFor="endDate" required>
            <input id="endDate" name="endDate" type="datetime-local" required defaultValue={toDateTimeLocal(event?.endDate)} className={inputClasses} />
          </Field>
        </div>
        <Field label="Timezone" htmlFor="timezone">
          <input id="timezone" name="timezone" defaultValue={event?.timezone ?? 'Africa/Lagos'} className={inputClasses} />
        </Field>
        <label className="flex items-center gap-2 font-sans text-sm text-ink">
          <input type="checkbox" name="isVirtual" defaultChecked={event?.isVirtual} className="h-4 w-4" />
          This is a virtual event
        </label>
        <Field label="Virtual Link" htmlFor="virtualLink">
          <input id="virtualLink" name="virtualLink" defaultValue={event?.virtualLink ?? ''} className={inputClasses} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Venue Name" htmlFor="venueName">
            <input id="venueName" name="venueName" defaultValue={event?.venueName ?? ''} className={inputClasses} />
          </Field>
          <Field label="Venue City" htmlFor="venueCity">
            <input id="venueCity" name="venueCity" defaultValue={event?.venueCity ?? ''} className={inputClasses} />
          </Field>
        </div>
        <Field label="Venue Country" htmlFor="venueCountry">
          <input id="venueCountry" name="venueCountry" defaultValue={event?.venueCountry ?? ''} className={inputClasses} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Registration &amp; Status</legend>
        <Field label="Registration Form" htmlFor="registrationFormId" hint="Create one under Form Builder if none exists yet.">
          <select id="registrationFormId" name="registrationFormId" defaultValue={event?.registrationFormId ?? ''} className={inputClasses}>
            <option value="">None</option>
            {forms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Capacity" htmlFor="capacity">
            <input id="capacity" name="capacity" type="number" min={0} defaultValue={event?.capacity ?? ''} className={inputClasses} />
          </Field>
          <Field label="Registration Status" htmlFor="registrationStatus" required>
            <select id="registrationStatus" name="registrationStatus" required defaultValue={event?.registrationStatus ?? 'OPEN'} className={inputClasses}>
              {REG_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Publish Status" htmlFor="status" required>
            <select id="status" name="status" required defaultValue={event?.status ?? 'DRAFT'} className={inputClasses}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2.5 font-sans text-sm text-ink">
            <input type="checkbox" name="featuredOnHomepage" defaultChecked={event?.featuredOnHomepage} className="h-4 w-4" />
            Feature on homepage
          </label>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">SEO</legend>
        <Field label="SEO Title" htmlFor="seoTitle">
          <input id="seoTitle" name="seoTitle" defaultValue={event?.seoTitle ?? ''} className={inputClasses} />
        </Field>
        <Field label="SEO Description" htmlFor="seoDescription">
          <textarea id="seoDescription" name="seoDescription" defaultValue={event?.seoDescription ?? ''} rows={2} className={inputClasses} />
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{event ? 'Save Event' : 'Create Event'}</SubmitButton>
      </div>
    </form>
  )
}
