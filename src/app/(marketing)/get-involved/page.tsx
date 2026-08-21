import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Kicker } from '@/components/ui/Section'
import { SetNavTone } from '@/components/marketing/NavTone'
import { InquiryForm } from '@/components/marketing/forms/InquiryForm'
import { cn } from '@/lib/cn'

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Join the community, become a fellow, partner with us, volunteer, or support the work of Kingdom E.L.E.C.T. for Africa.',
}

const INTEREST_OPTIONS = [
  {
    value: 'GET_INVOLVED_JOIN_COMMUNITY',
    label: 'Join the Community',
    slug: 'join-community',
    description: 'Become part of the network of Kingdom reformers already at work.',
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20c1-3.5 3.5-5.5 7-5.5s6 2 7 5.5" />
        <circle cx="17.5" cy="9" r="2.3" />
        <path d="M16 20c.5-2.5 2-4 4-4.3" />
      </>
    ),
  },
  {
    value: 'GET_INVOLVED_BECOME_FELLOW',
    label: 'Become a Fellow',
    slug: 'fellow',
    description: 'Enter a yearlong mentorship across the five spheres of influence.',
    icon: (
      <>
        <path d="M3 8l9-4 9 4-9 4-9-4Z" />
        <path d="M7 10v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5" />
      </>
    ),
  },
  {
    value: 'GET_INVOLVED_PARTNER',
    label: 'Partner With Us',
    slug: 'partner',
    description: "Align your organization's resources with Kingdom-scale transformation.",
    icon: <path d="M9 12h6M4 7h5l2 3h6l-2 8H8L6 12H4Z" />,
  },
  {
    value: 'GET_INVOLVED_VOLUNTEER',
    label: 'Volunteer',
    slug: 'volunteer',
    description: 'Give your time and skill directly to the work of the chamber.',
    icon: (
      <path d="M12 21s-7-4.6-9.5-9.2C.8 8.4 2.4 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.6 0 5.2 3.4 3.5 6.8C19 16.4 12 21 12 21Z" />
    ),
  },
  {
    value: 'GET_INVOLVED_ATTEND_EVENT',
    label: 'Attend an Event',
    slug: 'attend-event',
    description: 'Step into The Situation Room and the gatherings that follow it.',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 3v3M16 3v3" />
      </>
    ),
  },
  {
    value: 'GET_INVOLVED_SUBMIT_IDEA',
    label: 'Submit an Idea',
    slug: 'submit-idea',
    description: 'Bring a solution worth refining through collective Kingdom intelligence.',
    icon: (
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5.9 1.2.9 1.9V16h5.4v-.3c0-.7.3-1.4.9-1.9A6 6 0 0 0 12 3Z" />
    ),
  },
  {
    value: 'GET_INVOLVED_SUPPORT_WORK',
    label: 'Support the Work',
    slug: 'support',
    description: 'Fund the research, gatherings, and programs that carry this mandate forward.',
    icon: <path d="M20 7h-5.5a2.5 2.5 0 1 0-2.5 2.5H20M20 7v4M4 7h5.5A2.5 2.5 0 1 0 12 4.5M4 7v4M4 11h16v9H4v-9Z" />,
  },
  {
    value: 'GET_INVOLVED_INSTITUTIONAL_PARTNER',
    label: 'Become an Institutional Partner',
    slug: 'institutional-partner',
    description: "Formalize your institution's role in Africa's Kingdom transformation.",
    icon: (
      <>
        <rect x="4" y="9" width="7" height="12" />
        <rect x="13" y="4" width="7" height="17" />
        <path d="M7 13h1M7 16h1M16 8h1M16 11h1M16 14h1" />
      </>
    ),
  },
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
      <SetNavTone tone="light" />

      <section className="bg-ivory pt-[clamp(3.5rem,8vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <Container>
          <Kicker>Get Involved</Kicker>
          <h1 className="mt-4 max-w-[780px] font-serif text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.12] text-ink">
            This is not a spectator movement.
          </h1>
          <p className="mt-5 max-w-[560px] font-sans text-[1.05rem] leading-[1.8] text-body">
            Kingdom E.L.E.C.T. is built for those already producing measurable impact within their sphere, and ready
            to convert isolated excellence into collective influence.
          </p>
        </Container>
      </section>

      <section className="bg-ivory pb-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <div className="grid grid-cols-1 gap-px border border-line bg-line min-[621px]:grid-cols-2 min-[981px]:grid-cols-4">
            {INTEREST_OPTIONS.map((option) => {
              const active = matched?.slug === option.slug
              return (
                <a
                  key={option.slug}
                  href={`/get-involved?interest=${option.slug}#form`}
                  className={cn(
                    'group relative px-6 py-[1.9rem] text-left transition-colors duration-300',
                    active ? 'bg-navy' : 'bg-ivory hover:bg-navy',
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={cn(
                      'mb-[1.1rem] h-[30px] w-[30px] transition-colors duration-300',
                      active ? 'text-gold-light' : 'text-gold-dark group-hover:text-gold-light',
                    )}
                  >
                    {option.icon}
                  </svg>
                  <h4
                    className={cn(
                      'font-serif text-base font-semibold transition-colors duration-300',
                      active ? 'text-ivory' : 'text-ink group-hover:text-ivory',
                    )}
                  >
                    {option.label}
                  </h4>
                  <p
                    className={cn(
                      'mt-2 font-sans text-[0.82rem] leading-[1.55] transition-colors duration-300',
                      active ? 'text-body-on-navy' : 'text-body group-hover:text-body-on-navy',
                    )}
                  >
                    {option.description}
                  </p>
                </a>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="form" className="bg-ivory-dim py-[clamp(4.5rem,9vw,8.5rem)]">
        <Container>
          <div className="mx-auto max-w-[820px]">
            <Kicker>Take Your Position</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold text-ink">
              Tell us where you fit.
            </h2>
            <div className="mt-8">
              <InquiryForm
                typeOptions={INTEREST_OPTIONS.map(({ value, label }) => ({ value, label }))}
                defaultType={defaultType}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
