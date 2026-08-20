import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { InquiryForm } from '@/components/marketing/forms/InquiryForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Kingdom E.L.E.C.T. for Africa.',
}

const CONTACT_OPTIONS = [
  { value: 'CONTACT_GENERAL', label: 'General Enquiry' },
  { value: 'CONTACT_PARTNERSHIP', label: 'Partnership' },
  { value: 'CONTACT_MEDIA', label: 'Media' },
  { value: 'CONTACT_SPEAKING', label: 'Speaking' },
  { value: 'CONTACT_INTELLIGENCE', label: 'Kingdom Intelligence' },
  { value: 'CONTACT_EVENTS', label: 'Events' },
  { value: 'CONTACT_OTHER', label: 'Other' },
]

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } })

  return (
    <>
      <section className="bg-surface pb-16 pt-40 md:pt-48">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
            Let&rsquo;s talk.
          </h1>
        </Container>
      </section>

      <section className="bg-surface pb-24 md:pb-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-sans text-sm leading-relaxed text-ink-muted">
                For urgent matters, reach us directly using the details below. Otherwise, use the form and our team
                will route your message to the right desk.
              </p>
              <div className="mt-8 space-y-4 font-sans text-sm text-ink">
                {settings?.contactEmail && <p>{settings.contactEmail}</p>}
                {settings?.contactPhone && <p>{settings.contactPhone}</p>}
                {settings?.address && <p>{settings.address}</p>}
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <InquiryForm typeOptions={CONTACT_OPTIONS} />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
