import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import type { Chapter, Event, Organization, Partnership, PartnershipStatus, PartnershipType, Person, Program } from '@prisma/client'

const TYPE_OPTIONS: PartnershipType[] = ['STRATEGIC', 'FINANCIAL', 'MEDIA', 'CHAPTER', 'IN_KIND']
const STATUS_OPTIONS: PartnershipStatus[] = ['ACTIVE', 'PENDING', 'ENDED']

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

export function PartnershipForm({
  action,
  partnership,
  organizations,
  programs,
  events,
  chapters,
  people,
  showValue,
}: {
  action: (formData: FormData) => Promise<void>
  partnership?: Partnership
  organizations: Pick<Organization, 'id' | 'name'>[]
  programs: Pick<Program, 'id' | 'title'>[]
  events: Pick<Event, 'id' | 'title'>[]
  chapters: Pick<Chapter, 'id' | 'name'>[]
  people: Pick<Person, 'id' | 'firstName' | 'lastName'>[]
  /** Only FINANCE_ADMINISTRATOR / SUPER_ADMIN may see or edit the value field — omit entirely otherwise. */
  showValue: boolean
}) {
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Details</legend>
        <Field label="Organization" htmlFor="organizationId" required>
          <select id="organizationId" name="organizationId" required defaultValue={partnership?.organizationId ?? ''} className={inputClasses}>
            <option value="" disabled>Select a partner organization</option>
            {organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type" htmlFor="type" required>
            <select id="type" name="type" required defaultValue={partnership?.type ?? 'STRATEGIC'} className={inputClasses}>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>
          <Field label="Status" htmlFor="status" required>
            <select id="status" name="status" required defaultValue={partnership?.status ?? 'PENDING'} className={inputClasses}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Relates To</legend>
        <p className="font-sans text-xs text-ink-muted">Optional — link this partnership to whichever program, event, or chapter it supports.</p>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Program" htmlFor="relatedProgramId">
            <select id="relatedProgramId" name="relatedProgramId" defaultValue={partnership?.relatedProgramId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </Field>
          <Field label="Event" htmlFor="relatedEventId">
            <select id="relatedEventId" name="relatedEventId" defaultValue={partnership?.relatedEventId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </Field>
          <Field label="Chapter" htmlFor="relatedChapterId">
            <select id="relatedChapterId" name="relatedChapterId" defaultValue={partnership?.relatedChapterId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Term &amp; Contact</legend>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date" htmlFor="startDate">
            <input id="startDate" name="startDate" type="date" defaultValue={toDateInputValue(partnership?.startDate)} className={inputClasses} />
          </Field>
          <Field label="End Date" htmlFor="endDate">
            <input id="endDate" name="endDate" type="date" defaultValue={toDateInputValue(partnership?.endDate)} className={inputClasses} />
          </Field>
        </div>
        <Field label="Primary Contact" htmlFor="primaryContactId" hint="Optional — the Person on our side who owns this relationship.">
          <select id="primaryContactId" name="primaryContactId" defaultValue={partnership?.primaryContactId ?? ''} className={inputClasses}>
            <option value="">None</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
        </Field>
        {showValue && (
          <Field label="Value" htmlFor="value" hint="Financial detail — visible only to Finance Administrators and Super Admins.">
            <input id="value" name="value" defaultValue={partnership?.value ?? ''} className={inputClasses} placeholder="e.g. $50,000 / year" />
          </Field>
        )}
      </fieldset>

      <div>
        <SubmitButton>{partnership ? 'Save Partnership' : 'Create Partnership'}</SubmitButton>
      </div>
    </form>
  )
}
