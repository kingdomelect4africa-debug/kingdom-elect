import { prisma } from '@/lib/db'
import { updateSiteSettings } from '@/lib/actions/admin/pages'
import { PageHeader, Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'

export default async function SiteSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } })

  return (
    <div>
      <PageHeader title="Site Settings" description="Global settings used across the public website." />
      <SavedBanner saved={saved === '1'} />

      <form action={updateSiteSettings} className="flex max-w-2xl flex-col gap-6">
        <Field label="Site Name" htmlFor="siteName" required>
          <input id="siteName" name="siteName" required defaultValue={settings?.siteName ?? ''} className={inputClasses} />
        </Field>
        <Field label="Tagline" htmlFor="tagline" required>
          <input id="tagline" name="tagline" required defaultValue={settings?.tagline ?? ''} className={inputClasses} />
        </Field>
        <Field label="Contact Email" htmlFor="contactEmail">
          <input id="contactEmail" name="contactEmail" type="email" defaultValue={settings?.contactEmail ?? ''} className={inputClasses} />
        </Field>
        <Field label="Support Email" htmlFor="supportEmail">
          <input id="supportEmail" name="supportEmail" type="email" defaultValue={settings?.supportEmail ?? ''} className={inputClasses} />
        </Field>
        <Field label="Contact Phone" htmlFor="contactPhone">
          <input id="contactPhone" name="contactPhone" defaultValue={settings?.contactPhone ?? ''} className={inputClasses} />
        </Field>
        <Field label="Address" htmlFor="address">
          <input id="address" name="address" defaultValue={settings?.address ?? ''} className={inputClasses} />
        </Field>
        <Field label="Footer Text" htmlFor="footerText">
          <textarea id="footerText" name="footerText" defaultValue={settings?.footerText ?? ''} rows={3} className={inputClasses} />
        </Field>
        <Field label="Default SEO Title" htmlFor="defaultSeoTitle">
          <input id="defaultSeoTitle" name="defaultSeoTitle" defaultValue={settings?.defaultSeoTitle ?? ''} className={inputClasses} />
        </Field>
        <Field label="Default SEO Description" htmlFor="defaultSeoDescription">
          <textarea id="defaultSeoDescription" name="defaultSeoDescription" defaultValue={settings?.defaultSeoDescription ?? ''} rows={2} className={inputClasses} />
        </Field>
        <div>
          <SubmitButton>Save Settings</SubmitButton>
        </div>
      </form>
    </div>
  )
}
