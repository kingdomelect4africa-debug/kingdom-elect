import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { canAccessDomain } from '@/lib/rbac'
import { publicOrigin } from '@/lib/site'
import { PageHeader } from '@/components/admin/ui'
import { ShareLink } from '@/components/admin/forms/ShareLink'
import { ACCESS_TIERS, TIER_EVENT_SLUG, TIER_PATHS, tierFormName, tierQuestionList } from '@/lib/situation-room-tiers'

/** Read-only Form Builder entry for the VVIP and VIP forms, whose questions live in code. */
export default async function BuiltInFormPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: slug } = await params
  const tier = ACCESS_TIERS.find((option) => option.toLowerCase() === slug)
  if (!tier) notFound()

  const user = await requireUser()
  const [origin, event, registrations] = await Promise.all([
    publicOrigin(),
    prisma.event.findUnique({ where: { slug: TIER_EVENT_SLUG }, select: { title: true } }),
    prisma.registration.count({
      where: { event: { slug: TIER_EVENT_SLUG }, responses: { path: ['access_tier'], equals: tier } },
    }),
  ])
  const eventTitle = event?.title ?? 'The Situation Room'
  const questions = tierQuestionList(tier)

  return (
    <div>
      <PageHeader
        title={tierFormName(tier)}
        description={`${registrations} registration(s) for ${eventTitle}.`}
        actions={
          canAccessDomain(user, 'events') ? (
            <Link
              href={`/admin/registrations?tier=${tier}`}
              className="font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline"
              style={{ letterSpacing: '0.06em' }}
            >
              View Registrations →
            </Link>
          ) : undefined
        }
      />

      <section className="mb-8 max-w-3xl border border-border-subtle p-6">
        <h2 className="font-serif text-lg text-brand-primary">Share Link</h2>
        <div className="mt-4">
          <ShareLink url={`${origin}${TIER_PATHS[tier]}`} />
        </div>
        <p className="mt-3 font-sans text-sm text-ink-muted">
          Submissions are recorded as registrations for {eventTitle}, labelled {tier}.
        </p>
      </section>

      <section className="max-w-3xl border border-border-subtle p-6">
        <h2 className="font-serif text-lg text-brand-primary">Questions ({questions.length})</h2>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          This form has its own {tier} design, so its questions are part of the site&rsquo;s code and can&rsquo;t be edited
          here. Every question is required.
        </p>
        <ol className="mt-4 flex flex-col border border-border-subtle">
          {questions.map((question, index) => (
            <li key={question.label} className="flex gap-4 border-t border-border-subtle px-4 py-3 first:border-t-0">
              <span className="w-5 shrink-0 font-sans text-sm text-ink-muted">{index + 1}.</span>
              <span>
                <span className="block font-sans text-sm text-ink">{question.label}</span>
                <span className="mt-0.5 block font-sans text-xs text-ink-muted">{question.answers}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
