import { prisma } from '@/lib/db'
import { updateHomePageContent } from '@/lib/actions/admin/pages'
import { PageHeader, Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'

export default async function HomePageEditor({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams
  const content = await prisma.homePageContent.findUniqueOrThrow({ where: { id: 1 } })
  const momentStats = (content.momentStats as { value: string; label: string }[]) ?? []
  const frameworkSteps = (content.frameworkSteps as { label: string; description: string }[]) ?? []

  return (
    <div>
      <PageHeader title="Homepage" description="Every section of the public homepage is editable here." />
      <SavedBanner saved={saved === '1'} />

      <form action={updateHomePageContent} className="flex max-w-3xl flex-col gap-10">
        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Hero</legend>
          <Field label="Eyebrow" htmlFor="heroEyebrow">
            <input id="heroEyebrow" name="heroEyebrow" defaultValue={content.heroEyebrow ?? ''} className={inputClasses} />
          </Field>
          <Field label="Heading" htmlFor="heroHeading" required>
            <textarea id="heroHeading" name="heroHeading" required defaultValue={content.heroHeading} rows={2} className={inputClasses} />
          </Field>
          <Field label="Subheading" htmlFor="heroSubheading" required>
            <textarea id="heroSubheading" name="heroSubheading" required defaultValue={content.heroSubheading} rows={3} className={inputClasses} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Primary CTA Label" htmlFor="heroPrimaryCtaLabel" required>
              <input id="heroPrimaryCtaLabel" name="heroPrimaryCtaLabel" required defaultValue={content.heroPrimaryCtaLabel} className={inputClasses} />
            </Field>
            <Field label="Primary CTA Link" htmlFor="heroPrimaryCtaHref" required>
              <input id="heroPrimaryCtaHref" name="heroPrimaryCtaHref" required defaultValue={content.heroPrimaryCtaHref} className={inputClasses} />
            </Field>
            <Field label="Secondary CTA Label" htmlFor="heroSecondaryCtaLabel" required>
              <input id="heroSecondaryCtaLabel" name="heroSecondaryCtaLabel" required defaultValue={content.heroSecondaryCtaLabel} className={inputClasses} />
            </Field>
            <Field label="Secondary CTA Link" htmlFor="heroSecondaryCtaHref" required>
              <input id="heroSecondaryCtaHref" name="heroSecondaryCtaHref" required defaultValue={content.heroSecondaryCtaHref} className={inputClasses} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Africa&rsquo;s Defining Moment</legend>
          <Field label="Eyebrow" htmlFor="momentEyebrow">
            <input id="momentEyebrow" name="momentEyebrow" defaultValue={content.momentEyebrow ?? ''} className={inputClasses} />
          </Field>
          <Field label="Heading" htmlFor="momentHeading" required>
            <input id="momentHeading" name="momentHeading" required defaultValue={content.momentHeading} className={inputClasses} />
          </Field>
          <Field label="Body" htmlFor="momentBody" required>
            <textarea id="momentBody" name="momentBody" required defaultValue={content.momentBody} rows={4} className={inputClasses} />
          </Field>
          <p className="font-sans text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: '0.06em' }}>Stat Points</p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
              <Field label={`Stat ${i + 1} Value`} htmlFor={`momentStats.${i}.value`}>
                <input id={`momentStats.${i}.value`} name={`momentStats.${i}.value`} defaultValue={momentStats[i]?.value ?? ''} className={inputClasses} />
              </Field>
              <Field label={`Stat ${i + 1} Label`} htmlFor={`momentStats.${i}.label`}>
                <input id={`momentStats.${i}.label`} name={`momentStats.${i}.label`} defaultValue={momentStats[i]?.label ?? ''} className={inputClasses} />
              </Field>
            </div>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">The Kingdom Framework</legend>
          <Field label="Heading" htmlFor="frameworkHeading" required>
            <input id="frameworkHeading" name="frameworkHeading" required defaultValue={content.frameworkHeading} className={inputClasses} />
          </Field>
          <Field label="Intro" htmlFor="frameworkIntro" required>
            <textarea id="frameworkIntro" name="frameworkIntro" required defaultValue={content.frameworkIntro} rows={2} className={inputClasses} />
          </Field>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr]">
              <Field label={`Step ${i + 1} Label`} htmlFor={`frameworkSteps.${i}.label`}>
                <input id={`frameworkSteps.${i}.label`} name={`frameworkSteps.${i}.label`} defaultValue={frameworkSteps[i]?.label ?? ''} className={inputClasses} />
              </Field>
              <Field label={`Step ${i + 1} Description`} htmlFor={`frameworkSteps.${i}.description`}>
                <input id={`frameworkSteps.${i}.description`} name={`frameworkSteps.${i}.description`} defaultValue={frameworkSteps[i]?.description ?? ''} className={inputClasses} />
              </Field>
            </div>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">The Five, Situation Room &amp; Intelligence Teasers</legend>
          <Field label="The Five — Heading" htmlFor="fiveHeading" required>
            <input id="fiveHeading" name="fiveHeading" required defaultValue={content.fiveHeading} className={inputClasses} />
          </Field>
          <Field label="The Five — Intro" htmlFor="fiveIntro" required>
            <textarea id="fiveIntro" name="fiveIntro" required defaultValue={content.fiveIntro} rows={2} className={inputClasses} />
          </Field>
          <Field label="Situation Room — Heading" htmlFor="situationRoomHeading" required>
            <input id="situationRoomHeading" name="situationRoomHeading" required defaultValue={content.situationRoomHeading} className={inputClasses} />
          </Field>
          <Field label="Situation Room — Body" htmlFor="situationRoomBody" required>
            <textarea id="situationRoomBody" name="situationRoomBody" required defaultValue={content.situationRoomBody} rows={2} className={inputClasses} />
          </Field>
          <Field label="Kingdom Intelligence — Heading" htmlFor="intelligenceHeading" required>
            <input id="intelligenceHeading" name="intelligenceHeading" required defaultValue={content.intelligenceHeading} className={inputClasses} />
          </Field>
          <Field label="Kingdom Intelligence — Intro" htmlFor="intelligenceIntro" required>
            <textarea id="intelligenceIntro" name="intelligenceIntro" required defaultValue={content.intelligenceIntro} rows={2} className={inputClasses} />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Participation Call to Action</legend>
          <Field label="Heading" htmlFor="participationHeading" required>
            <input id="participationHeading" name="participationHeading" required defaultValue={content.participationHeading} className={inputClasses} />
          </Field>
          <Field label="Body" htmlFor="participationBody" required>
            <textarea id="participationBody" name="participationBody" required defaultValue={content.participationBody} rows={2} className={inputClasses} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="CTA Label" htmlFor="participationCtaLabel" required>
              <input id="participationCtaLabel" name="participationCtaLabel" required defaultValue={content.participationCtaLabel} className={inputClasses} />
            </Field>
            <Field label="CTA Link" htmlFor="participationCtaHref" required>
              <input id="participationCtaHref" name="participationCtaHref" required defaultValue={content.participationCtaHref} className={inputClasses} />
            </Field>
          </div>
        </fieldset>

        <div>
          <SubmitButton>Save Homepage</SubmitButton>
        </div>
      </form>
    </div>
  )
}
