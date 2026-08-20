import { prisma } from '@/lib/db'
import { updateTheFivePageContent } from '@/lib/actions/admin/pages'
import { PageHeader, Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import type { PillarContent } from '@/components/marketing/the-five/FiveExplorer'

export default async function TheFivePageEditor({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams
  const content = await prisma.theFivePageContent.findUniqueOrThrow({ where: { id: 1 } })
  const pillars = (content.pillars as PillarContent[]) ?? []

  return (
    <div>
      <PageHeader title="The Five" description="Related programs, intelligence, and stories are pulled in automatically by pillar tag — only the narrative copy is edited here." />
      <SavedBanner saved={saved === '1'} />

      <form action={updateTheFivePageContent} className="flex max-w-3xl flex-col gap-10">
        <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
          <legend className="px-2 font-serif text-lg text-brand-primary">Intro</legend>
          <Field label="Heading" htmlFor="heading" required>
            <input id="heading" name="heading" required defaultValue={content.heading} className={inputClasses} />
          </Field>
          <Field label="Intro" htmlFor="intro" required>
            <textarea id="intro" name="intro" required defaultValue={content.intro} rows={2} className={inputClasses} />
          </Field>
        </fieldset>

        {pillars.map((pillar, i) => (
          <fieldset key={pillar.key} className="flex flex-col gap-4 border border-border-subtle p-6">
            <legend className="px-2 font-serif text-lg text-brand-primary">{pillar.name}</legend>
            <Field label="Tagline" htmlFor={`pillars.${i}.tagline`}>
              <input id={`pillars.${i}.tagline`} name={`pillars.${i}.tagline`} defaultValue={pillar.tagline} className={inputClasses} />
            </Field>
            <Field label="Body" htmlFor={`pillars.${i}.body`}>
              <textarea id={`pillars.${i}.body`} name={`pillars.${i}.body`} defaultValue={pillar.body} rows={3} className={inputClasses} />
            </Field>
            <Field label="Sphere of Influence" htmlFor={`pillars.${i}.sphereOfInfluence`} hint="Comma-separated">
              <input
                id={`pillars.${i}.sphereOfInfluence`}
                name={`pillars.${i}.sphereOfInfluence`}
                defaultValue={pillar.sphereOfInfluence.join(', ')}
                className={inputClasses}
              />
            </Field>
          </fieldset>
        ))}

        <div>
          <SubmitButton>Save The Five Page</SubmitButton>
        </div>
      </form>
    </div>
  )
}
