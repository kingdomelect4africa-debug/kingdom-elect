import { prisma } from '@/lib/db'
import { updateSituationRoomPageContent } from '@/lib/actions/admin/pages'
import { PageHeader, Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'

export default async function SituationRoomPageEditor({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams
  const [content, events] = await Promise.all([
    prisma.situationRoomPageContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, title: true, slug: true } }),
  ])
  const functions = (content.functions as { title: string; body: string }[]) ?? []
  const sessionTypes = (content.sessionTypes as string[]) ?? []
  const outcomes = (content.outcomes as string[]) ?? []

  return (
    <div>
      <PageHeader title="The Situation Room" description="The governance-chamber page, including which live event the Register CTA points to." />
      <SavedBanner saved={saved === '1'} />

      <form action={updateSituationRoomPageContent} className="flex max-w-3xl flex-col gap-10">
        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Hero</legend>
          <Field label="Heading" htmlFor="heroHeading" required>
            <input id="heroHeading" name="heroHeading" required defaultValue={content.heroHeading} className={inputClasses} />
          </Field>
          <Field label="Subheading" htmlFor="heroSubheading" required>
            <textarea id="heroSubheading" name="heroSubheading" required defaultValue={content.heroSubheading} rows={2} className={inputClasses} />
          </Field>
          <Field label="Philosophy Statement" htmlFor="philosophyStatement" required>
            <textarea id="philosophyStatement" name="philosophyStatement" required defaultValue={content.philosophyStatement} rows={2} className={inputClasses} />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Featured Event</legend>
          <Field label="Which event does the Register CTA link to?" htmlFor="featuredEventId" hint="Only events created under Events will appear here.">
            <select id="featuredEventId" name="featuredEventId" defaultValue={content.featuredEventId ?? ''} className={inputClasses}>
              <option value="">None</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Four Functions</legend>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid gap-3 border-t border-border-subtle pt-4 first:border-t-0 first:pt-0">
              <Field label={`Function ${i + 1} Title`} htmlFor={`functions.${i}.title`}>
                <input id={`functions.${i}.title`} name={`functions.${i}.title`} defaultValue={functions[i]?.title ?? ''} className={inputClasses} />
              </Field>
              <Field label={`Function ${i + 1} Body`} htmlFor={`functions.${i}.body`}>
                <textarea id={`functions.${i}.body`} name={`functions.${i}.body`} defaultValue={functions[i]?.body ?? ''} rows={2} className={inputClasses} />
              </Field>
            </div>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Session Types (up to 8)</legend>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Field key={i} label={`Session Type ${i + 1}`} htmlFor={`sessionTypes.${i}`}>
              <input id={`sessionTypes.${i}`} name={`sessionTypes.${i}`} defaultValue={sessionTypes[i] ?? ''} className={inputClasses} />
            </Field>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Expected Outcomes (up to 7)</legend>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Field key={i} label={`Outcome ${i + 1}`} htmlFor={`outcomes.${i}`}>
              <input id={`outcomes.${i}`} name={`outcomes.${i}`} defaultValue={outcomes[i] ?? ''} className={inputClasses} />
            </Field>
          ))}
        </fieldset>

        <div>
          <SubmitButton>Save Situation Room Page</SubmitButton>
        </div>
      </form>
    </div>
  )
}
