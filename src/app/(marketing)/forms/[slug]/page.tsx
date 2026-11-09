import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/marketing/PageHero'
import { Reveal } from '@/components/motion/primitives'
import { SetNavTone } from '@/components/marketing/NavTone'
import { RegistrationForm } from '@/components/marketing/forms/RegistrationForm'
import { ApplicationForm } from '@/components/marketing/forms/ApplicationForm'
import { StandaloneForm } from '@/components/marketing/forms/StandaloneForm'
import type { FormFieldConfig } from '@/lib/forms'
import { TIER_PATHS, isAccessTier } from '@/lib/situation-room-tiers'

type SearchParams = Promise<{ event?: string; program?: string }>

async function getForm(slug: string) {
  return prisma.formDefinition.findUnique({
    where: { slug },
    include: {
      events: {
        orderBy: { startDate: 'asc' },
        select: { slug: true, title: true, summary: true, registrationStatus: true },
      },
      programs: {
        orderBy: { title: 'asc' },
        select: { slug: true, title: true, summary: true, status: true },
      },
    },
  })
}

type Form = NonNullable<Awaited<ReturnType<typeof getForm>>>

/**
 * Where a submission through this link goes. A form attached to one event or
 * program hands off to that registration/application flow; one attached to
 * several needs ?event= / ?program= (or the visitor picks); an unattached
 * form stores its own responses. Returns null for a ?event=/?program= the
 * form isn't attached to (e.g. a link shared before it was detached).
 */
function resolveTarget(form: Form, params: { event?: string; program?: string }) {
  if (params.event) {
    const event = form.events.find((e) => e.slug === params.event)
    return event ? ({ kind: 'event', event } as const) : null
  }
  if (params.program) {
    const program = form.programs.find((p) => p.slug === params.program)
    return program ? ({ kind: 'program', program } as const) : null
  }
  const total = form.events.length + form.programs.length
  if (total === 0) return { kind: 'standalone' } as const
  if (total > 1) return { kind: 'choose' } as const
  return form.events[0]
    ? ({ kind: 'event', event: form.events[0] } as const)
    : ({ kind: 'program', program: form.programs[0] } as const)
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: SearchParams
}): Promise<Metadata> {
  const { slug } = await params
  const form = await getForm(slug)
  if (!form) return {}
  const target = resolveTarget(form, await searchParams)
  const title =
    target?.kind === 'event' ? `Register — ${target.event.title}`
    : target?.kind === 'program' ? `Apply — ${target.program.title}`
    : form.name
  return { title, robots: { index: false } }
}

export default async function FormLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: SearchParams
}) {
  const { slug } = await params
  const form = await getForm(slug)
  if (!form) notFound()
  // The VVIP and VIP forms are only ever filled in on their own designed pages.
  if (isAccessTier(form.accessTier)) redirect(TIER_PATHS[form.accessTier])

  const target = resolveTarget(form, await searchParams)
  if (!target) notFound()

  const fields = Array.isArray(form.fields) ? (form.fields as unknown as FormFieldConfig[]) : []

  let kicker = 'Form'
  let title = form.name
  let summary: string | null = null
  let body: React.ReactNode

  if (target.kind === 'event') {
    kicker = 'Event Registration'
    title = target.event.title
    summary = target.event.summary
    body =
      target.event.registrationStatus === 'CLOSED' ? (
        <p className="font-sans text-sm text-body">Registration for this event is closed.</p>
      ) : (
        <RegistrationForm eventSlug={target.event.slug} fields={fields} />
      )
  } else if (target.kind === 'program') {
    kicker = 'Program Application'
    title = target.program.title
    summary = target.program.summary
    body =
      target.program.status !== 'OPEN_FOR_APPLICATIONS' ? (
        <p className="font-sans text-sm text-body">Applications for this program are closed.</p>
      ) : (
        <ApplicationForm programSlug={target.program.slug} fields={fields} />
      )
  } else if (target.kind === 'choose') {
    body = (
      <div>
        <p className="font-sans text-sm text-body">Choose what you&rsquo;re responding for:</p>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {form.events.map((event) => (
            <li key={`event-${event.slug}`}>
              <Link href={`/forms/${form.slug}?event=${event.slug}`} className="flex items-center justify-between gap-4 py-4 font-sans text-ink hover:text-brand-primary">
                <span>{event.title}</span>
                <span className="text-xs uppercase text-body" style={{ letterSpacing: '0.06em' }}>Register →</span>
              </Link>
            </li>
          ))}
          {form.programs.map((program) => (
            <li key={`program-${program.slug}`}>
              <Link href={`/forms/${form.slug}?program=${program.slug}`} className="flex items-center justify-between gap-4 py-4 font-sans text-ink hover:text-brand-primary">
                <span>{program.title}</span>
                <span className="text-xs uppercase text-body" style={{ letterSpacing: '0.06em' }}>Apply →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    body =
      fields.length > 0 ? (
        <StandaloneForm formSlug={form.slug} fields={fields} />
      ) : (
        <p className="font-sans text-sm text-body">This form isn&rsquo;t accepting responses yet.</p>
      )
  }

  return (
    <>
      <SetNavTone tone="dark" />
      <PageHero id="form" eyebrow={kicker} title={title} intro={summary} motif="arcs">
        {target.kind === 'event' && (
          <Link href={`/events/${target.event.slug}`} className="mt-6 inline-block font-sans text-sm text-gold-light underline-offset-4 hover:underline">
            View event details →
          </Link>
        )}
        {target.kind === 'program' && (
          <Link href={`/programs/${target.program.slug}`} className="mt-6 inline-block font-sans text-sm text-gold-light underline-offset-4 hover:underline">
            View program details →
          </Link>
        )}
      </PageHero>

      <section className="bg-ivory pb-[clamp(4.5rem,9vw,8.5rem)] pt-[clamp(3rem,6vw,4.5rem)]">
        <Container>
          <Reveal amount={0.02} className="mx-auto max-w-[680px] rounded-[var(--radius-md)] border border-line bg-ivory p-[1.75rem] shadow-[0_30px_70px_-45px_rgba(11,31,58,0.45)] sm:p-10">
            {body}
          </Reveal>
        </Container>
      </section>
    </>
  )
}
