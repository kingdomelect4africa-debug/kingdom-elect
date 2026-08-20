import { prisma } from '@/lib/db'
import { updateAboutPageContent } from '@/lib/actions/admin/pages'
import { PageHeader, Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'

export default async function AboutPageEditor({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams
  const content = await prisma.aboutPageContent.findUniqueOrThrow({ where: { id: 1 } })
  const objectives = (content.objectives as { title: string; body: string }[]) ?? []
  const personality = (content.personality as { trait: string }[]) ?? []

  return (
    <div>
      <PageHeader title="About" description="Every section of the public About page is editable here." />
      <SavedBanner saved={saved === '1'} />

      <form action={updateAboutPageContent} className="flex max-w-3xl flex-col gap-10">
        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Hero</legend>
          <Field label="Heading" htmlFor="heroHeading" required>
            <textarea id="heroHeading" name="heroHeading" required defaultValue={content.heroHeading} rows={2} className={inputClasses} />
          </Field>
          <Field label="Body" htmlFor="heroBody" required>
            <textarea id="heroBody" name="heroBody" required defaultValue={content.heroBody} rows={3} className={inputClasses} />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Why E.L.E.C.T.</legend>
          <Field label="Heading" htmlFor="storyHeading" required>
            <input id="storyHeading" name="storyHeading" required defaultValue={content.storyHeading} className={inputClasses} />
          </Field>
          <Field label="Body" htmlFor="storyBody" required>
            <textarea id="storyBody" name="storyBody" required defaultValue={content.storyBody} rows={4} className={inputClasses} />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Statements</legend>
          <Field label="Vision" htmlFor="visionStatement" required>
            <textarea id="visionStatement" name="visionStatement" required defaultValue={content.visionStatement} rows={2} className={inputClasses} />
          </Field>
          <Field label="Mission" htmlFor="missionStatement" required>
            <textarea id="missionStatement" name="missionStatement" required defaultValue={content.missionStatement} rows={2} className={inputClasses} />
          </Field>
          <Field label="Purpose" htmlFor="purposeStatement" required>
            <textarea id="purposeStatement" name="purposeStatement" required defaultValue={content.purposeStatement} rows={2} className={inputClasses} />
          </Field>
          <Field label="Essence" htmlFor="essenceStatement" required>
            <textarea id="essenceStatement" name="essenceStatement" required defaultValue={content.essenceStatement} rows={2} className={inputClasses} />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Six Objectives</legend>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid gap-3 border-t border-border-subtle pt-4 first:border-t-0 first:pt-0">
              <Field label={`Objective ${i + 1} Title`} htmlFor={`objectives.${i}.title`}>
                <input id={`objectives.${i}.title`} name={`objectives.${i}.title`} defaultValue={objectives[i]?.title ?? ''} className={inputClasses} />
              </Field>
              <Field label={`Objective ${i + 1} Body`} htmlFor={`objectives.${i}.body`}>
                <textarea id={`objectives.${i}.body`} name={`objectives.${i}.body`} defaultValue={objectives[i]?.body ?? ''} rows={2} className={inputClasses} />
              </Field>
            </div>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Brand Personality (8 traits)</legend>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Field key={i} label={`Trait ${i + 1}`} htmlFor={`personality.${i}.trait`}>
                <input id={`personality.${i}.trait`} name={`personality.${i}.trait`} defaultValue={personality[i]?.trait ?? ''} className={inputClasses} />
              </Field>
            ))}
          </div>
        </fieldset>

        <div>
          <SubmitButton>Save About Page</SubmitButton>
        </div>
      </form>
    </div>
  )
}
