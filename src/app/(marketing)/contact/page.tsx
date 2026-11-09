import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { SetNavTone } from '@/components/marketing/NavTone'
import { PageHero } from '@/components/marketing/PageHero'
import { InquiryForm } from '@/components/marketing/forms/InquiryForm'
import { Reveal } from '@/components/motion/primitives'

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
  const details = [
    { label: 'Email', value: settings?.contactEmail },
    { label: 'Support', value: settings?.supportEmail },
    { label: 'Phone', value: settings?.contactPhone },
    { label: 'Address', value: settings?.address },
  ].filter((detail): detail is { label: string; value: string } => Boolean(detail.value))

  return (
    <>
      <SetNavTone tone="dark" />
      <PageHero
        id="contact"
        eyebrow="Contact"
        title="Let’s talk."
        intro="For urgent matters, reach us directly using the details below. Otherwise, use the form and our team will route your message to the right desk."
        motif="arcs"
      />

      <section className="bg-ivory py-[clamp(4rem,8vw,6.5rem)]">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col gap-7">
              {details.map((detail, i) => (
                <Reveal key={detail.label} delay={i * 0.08} y={16} className="border-t border-line pt-5">
                  <span className="font-sans text-[0.7rem] font-semibold uppercase text-body" style={{ letterSpacing: '0.1em' }}>
                    {detail.label}
                  </span>
                  <div className="mt-[0.4rem] break-words font-serif text-[1.15rem] text-ink">{detail.value}</div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <InquiryForm typeOptions={CONTACT_OPTIONS} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
