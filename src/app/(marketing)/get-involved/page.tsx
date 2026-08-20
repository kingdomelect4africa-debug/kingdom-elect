import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { InquiryForm } from '@/components/marketing/forms/InquiryForm'

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Join the community, become a fellow, partner with us, volunteer, or support the work of Kingdom E.L.E.C.T. for Africa.',
}

const INTEREST_OPTIONS = [
  { value: 'GET_INVOLVED_JOIN_COMMUNITY', label: 'Join the Community', slug: 'join-community' },
  { value: 'GET_INVOLVED_BECOME_FELLOW', label: 'Become a Fellow', slug: 'fellow' },
  { value: 'GET_INVOLVED_PARTNER', label: 'Partner With Us', slug: 'partner' },
  { value: 'GET_INVOLVED_VOLUNTEER', label: 'Volunteer', slug: 'volunteer' },
  { value: 'GET_INVOLVED_ATTEND_EVENT', label: 'Attend an Event', slug: 'attend-event' },
  { value: 'GET_INVOLVED_SUBMIT_IDEA', label: 'Submit an Idea', slug: 'submit-idea' },
  { value: 'GET_INVOLVED_SUPPORT_WORK', label: 'Support the Work', slug: 'support' },
  { value: 'GET_INVOLVED_INSTITUTIONAL_PARTNER', label: 'Become an Institutional Partner', slug: 'institutional-partner' },
]

export default async function GetInvolvedPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string; program?: string }>
}) {
  const { interest, program } = await searchParams
  const matched = INTEREST_OPTIONS.find((o) => o.slug === interest)
  const defaultType = program ? 'GET_INVOLVED_BECOME_FELLOW' : matched?.value

  return (
    <>
      <section className="bg-surface pb-16 pt-40 md:pt-48">
        <Container>
          <Eyebrow>Get Involved</Eyebrow>
          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-brand-primary md:text-6xl">
            This is not a spectator movement.
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-ink-muted">
            Kingdom E.L.E.C.T. is built for those already producing measurable impact within their sphere, and ready
            to convert isolated excellence into collective influence.
          </p>
        </Container>
      </section>

      <section className="bg-surface pb-24 md:pb-32">
        <Container>
          <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INTEREST_OPTIONS.map((option) => (
              <div key={option.slug} className="border border-border-subtle p-5">
                <p className="font-sans text-sm text-brand-primary">{option.label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-2xl">
            <InquiryForm typeOptions={INTEREST_OPTIONS.map(({ value, label }) => ({ value, label }))} defaultType={defaultType} />
          </div>
        </Container>
      </section>
    </>
  )
}
