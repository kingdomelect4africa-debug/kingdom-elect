import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'
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
      <SetNavTone tone="light" />

      <section className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Kicker>Contact</Kicker>
              <h1 className="mt-4 font-serif text-[clamp(2.2rem,4.4vw,3.2rem)] font-semibold leading-[1.12] text-ink">
                Let&rsquo;s talk.
              </h1>
              <p className="mt-6 max-w-[340px] font-sans text-[1.05rem] leading-[1.8] text-body">
                For urgent matters, reach us directly using the details below. Otherwise, use the form and our team
                will route your message to the right desk.
              </p>

              {settings?.contactEmail && (
                <div className="mt-7">
                  <span className="font-sans text-[0.7rem] uppercase text-body" style={{ letterSpacing: '0.1em' }}>
                    Email
                  </span>
                  <div className="mt-[0.4rem] font-serif text-[1.1rem] text-ink">{settings.contactEmail}</div>
                </div>
              )}
              {settings?.supportEmail && (
                <div className="mt-7">
                  <span className="font-sans text-[0.7rem] uppercase text-body" style={{ letterSpacing: '0.1em' }}>
                    Support
                  </span>
                  <div className="mt-[0.4rem] font-serif text-[1.1rem] text-ink">{settings.supportEmail}</div>
                </div>
              )}
              {settings?.contactPhone && (
                <div className="mt-7">
                  <span className="font-sans text-[0.7rem] uppercase text-body" style={{ letterSpacing: '0.1em' }}>
                    Phone
                  </span>
                  <div className="mt-[0.4rem] font-serif text-[1.1rem] text-ink">{settings.contactPhone}</div>
                </div>
              )}
              {settings?.address && (
                <div className="mt-7">
                  <span className="font-sans text-[0.7rem] uppercase text-body" style={{ letterSpacing: '0.1em' }}>
                    Address
                  </span>
                  <div className="mt-[0.4rem] font-serif text-[1.1rem] text-ink">{settings.address}</div>
                </div>
              )}
            </div>

            <div>
              <InquiryForm typeOptions={CONTACT_OPTIONS} />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
