import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateForm, deleteForm } from '@/lib/actions/admin/forms'
import { requireUser } from '@/lib/auth'
import { canAccessDomain } from '@/lib/rbac'
import { loadAttachTargets } from '@/lib/form-attachments'
import { publicOrigin } from '@/lib/site'
import { formatDate } from '@/lib/format'
import { PageHeader, SubmitButton } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { FormBuilder } from '@/components/admin/forms/FormBuilder'
import { ShareLink } from '@/components/admin/forms/ShareLink'
import { fieldLabels, type FormFieldConfig, type FormFieldType } from '@/lib/forms'
import { TIER_EVENT_SLUG, TIER_PATHS, isAccessTier } from '@/lib/situation-room-tiers'

// The VVIP and VIP pages have nowhere to store uploads.
const TIER_FIELD_TYPES: FormFieldType[] = ['text', 'textarea', 'email', 'phone', 'number', 'date', 'country', 'dropdown', 'radio', 'checkbox', 'consent']

const RESPONSES_SHOWN = 200

function formatResponseValue(value: unknown): string {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

export default async function EditFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const user = await requireUser()
  const [form, { events, programs }, origin] = await Promise.all([
    prisma.formDefinition.findUnique({
      where: { id },
      include: {
        events: { orderBy: { startDate: 'asc' }, select: { slug: true, title: true, registrationStatus: true } },
        programs: { orderBy: { title: 'asc' }, select: { slug: true, title: true, status: true } },
        submissions: {
          orderBy: { createdAt: 'desc' },
          take: RESPONSES_SHOWN,
          include: { person: { select: { firstName: true, lastName: true, email: true } } },
        },
        _count: { select: { events: true, programs: true, cohorts: true, submissions: true } },
      },
    }),
    loadAttachTargets(user),
    publicOrigin(),
  ])

  if (!form) notFound()

  // The forms behind the VVIP and VIP pages: same editor, their own link,
  // and submissions that land in Registrations rather than on the form.
  const tier = isAccessTier(form.accessTier) ? form.accessTier : null
  const [tierEvent, tierRegistrations] = tier
    ? await Promise.all([
        prisma.event.findUnique({ where: { slug: TIER_EVENT_SLUG }, select: { title: true } }),
        prisma.registration.count({ where: { event: { slug: TIER_EVENT_SLUG }, responses: { path: ['access_tier'], equals: tier } } }),
      ])
    : [null, 0]
  const tierEventTitle = tierEvent?.title ?? 'The Situation Room'

  const fields = Array.isArray(form.fields) ? (form.fields as unknown as FormFieldConfig[]) : []
  const labels = fieldLabels(form.fields)
  const attached = form._count.events > 0 || form._count.programs > 0 || form._count.cohorts > 0
  const formUrl = `${origin}/forms/${form.slug}`
  const linkTargets = form.events.length + form.programs.length
  const onlyEvent = linkTargets === 1 ? form.events[0] : undefined
  const onlyProgram = linkTargets === 1 ? form.programs[0] : undefined

  // Mirrors resolveTarget() on the public /forms/[slug] page.
  let linkNote: string
  if (onlyEvent) {
    linkNote = `Submissions are recorded as registrations for ${onlyEvent.title}.`
    if (onlyEvent.registrationStatus === 'CLOSED') linkNote += ' Registration is currently closed, so the link says so instead of showing the form.'
  } else if (onlyProgram) {
    linkNote = `Submissions are recorded as applications to ${onlyProgram.title}.`
    if (onlyProgram.status !== 'OPEN_FOR_APPLICATIONS') linkNote += ' Applications are currently closed, so the link says so instead of showing the form.'
  } else if (linkTargets > 1) {
    linkNote = 'This form is attached to several events and programs, so the link first asks visitors which one they’re responding for.'
  } else {
    linkNote = 'Responses are saved to this form and listed under Responses below.'
  }

  return (
    <div>
      <PageHeader
        title={form.name}
        description={
          tier
            ? `The ${tier} registration page for ${tierEventTitle}. ${tierRegistrations} registration(s) so far.`
            : `Used by ${form._count.events} event(s) and ${form._count.programs} program(s).`
        }
        actions={
          tier && canAccessDomain(user, 'events') ? (
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
      <SavedBanner saved={saved === '1'} />

      <section className="mb-8 max-w-3xl border border-border-subtle p-6">
        <h2 className="font-serif text-lg text-brand-primary">Share Link</h2>
        <div className="mt-4">
          <ShareLink url={tier ? `${origin}${TIER_PATHS[tier]}` : formUrl} />
        </div>
        <p className="mt-3 font-sans text-sm text-ink-muted">
          {tier
            ? `The questions below appear on this page in its ${tier} design. Each submission is recorded as a registration for ${tierEventTitle}, labelled ${tier}.`
            : linkNote}
        </p>

        {!tier && linkTargets > 1 && (
          <div className="mt-5 flex flex-col gap-4 border-t border-border-subtle pt-5">
            <p className="font-sans text-sm text-ink">Or share a direct link that skips that choice:</p>
            {form.events.map((event) => (
              <ShareLink key={`event-${event.slug}`} label={`${event.title} — registration`} url={`${formUrl}?event=${event.slug}`} />
            ))}
            {form.programs.map((program) => (
              <ShareLink key={`program-${program.slug}`} label={`${program.title} — application`} url={`${formUrl}?program=${program.slug}`} />
            ))}
          </div>
        )}
      </section>

      <FormBuilder
        action={updateForm.bind(null, form.id)}
        form={form}
        initialFields={fields}
        events={tier ? undefined : events}
        programs={tier ? undefined : programs}
        fieldTypes={tier ? TIER_FIELD_TYPES : undefined}
        needsEmail={Boolean(tier)}
      />

      {!tier && (form.submissions.length > 0 || linkTargets === 0) && (
        <section className="mt-10 max-w-3xl border border-border-subtle p-6">
          <h2 className="font-serif text-lg text-brand-primary">Responses ({form._count.submissions})</h2>
          {linkTargets > 0 && (
            <p className="mt-2 font-sans text-sm text-ink-muted">
              Collected while this form wasn&rsquo;t attached to an event or program. New submissions go to that
              event&rsquo;s registrations or program&rsquo;s applications instead.
            </p>
          )}

          {form.submissions.length === 0 ? (
            <p className="mt-4 font-sans text-sm text-ink-muted">No responses yet. Share the link above to start collecting them.</p>
          ) : (
            <div className="mt-4 flex flex-col border border-border-subtle">
              {form.submissions.map((submission) => {
                const name = submission.person
                  ? [submission.person.firstName, submission.person.lastName].filter((n) => n && n !== '—').join(' ')
                  : 'Anonymous'
                const responses = (submission.responses ?? {}) as Record<string, unknown>
                return (
                  <details key={submission.id} className="border-t border-border-subtle first:border-t-0">
                    <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 px-4 py-3 font-sans text-sm text-ink hover:bg-navy-50/50">
                      <span>
                        {name}
                        {submission.person?.email && <span className="text-ink-muted"> · {submission.person.email}</span>}
                      </span>
                      <span className="text-xs text-ink-muted">{formatDate(submission.createdAt)}</span>
                    </summary>
                    <dl className="flex flex-col gap-3 border-t border-border-subtle px-4 py-4 font-sans text-sm">
                      {Object.entries(responses).map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: '0.05em' }}>
                            {labels[key] ?? key}
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-ink">{formatResponseValue(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )
              })}
            </div>
          )}
          {form._count.submissions > RESPONSES_SHOWN && (
            <p className="mt-3 font-sans text-xs text-ink-muted">Showing the latest {RESPONSES_SHOWN}.</p>
          )}
        </section>
      )}

      <div className="mt-8 max-w-3xl">
        {tier ? (
          <p className="border border-dashed border-border-strong p-4 font-sans text-sm text-ink-muted">
            This form runs the {tier} registration page, so it can&rsquo;t be deleted.
          </p>
        ) : attached ? (
          <p className="border border-dashed border-border-strong p-4 font-sans text-sm text-ink-muted">
            This form can&rsquo;t be deleted while it&rsquo;s attached to {form._count.events} event(s),{' '}
            {form._count.programs} program(s) or {form._count.cohorts} cohort(s). Uncheck them under Attach To first.
          </p>
        ) : (
          <form action={deleteForm.bind(null, form.id)}>
            {form._count.submissions > 0 && (
              <p className="mb-3 font-sans text-sm text-ink-muted">
                Deleting this form also deletes its {form._count.submissions} response(s).
              </p>
            )}
            <SubmitButton variant="danger">Delete Form</SubmitButton>
          </form>
        )}
      </div>
    </div>
  )
}
