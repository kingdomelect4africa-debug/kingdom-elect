import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { updatePerson, deletePerson } from '@/lib/actions/admin/people'
import { PageHeader, SubmitButton, Badge } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { PersonForm } from '@/components/admin/people/PersonForm'
import { formatDate } from '@/lib/format'

const AFFILIATION_LABELS: Record<string, string> = {
  MEMBER: 'Member', FELLOW: 'Fellow', VOLUNTEER: 'Volunteer',
  PARTNER_CONTACT: 'Partner Contact', CONTRIBUTOR: 'Contributor',
}

export default async function EditPersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams
  const user = await getCurrentUser()

  const [person, organizations, chapters] = await Promise.all([
    prisma.person.findUnique({
      where: { id },
      include: {
        affiliations: {
          include: {
            relatedChapter: { select: { name: true } },
            relatedOrganization: { select: { name: true } },
            relatedProgram: { select: { title: true } },
          },
          orderBy: { startDate: 'desc' },
        },
        registrations: {
          include: { event: { select: { title: true, slug: true, startDate: true } } },
          orderBy: { createdAt: 'desc' },
        },
        applications: {
          include: { program: { select: { title: true, slug: true } } },
          orderBy: { createdAt: 'desc' },
        },
        speakerAppearances: {
          include: { event: { select: { title: true, slug: true, startDate: true } } },
        },
      },
    }),
    prisma.organization.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.chapter.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ])

  if (!person) notFound()

  // Defense in depth: a Chapter Administrator should not even be able to
  // view a person outside their own chapter, not just fail to save.
  if (user?.role === 'CHAPTER_ADMINISTRATOR' && user.chapterId !== person.homeChapterId) notFound()

  const lockedChapter =
    user?.role === 'CHAPTER_ADMINISTRATOR' && user.chapterId
      ? chapters.find((c) => c.id === user.chapterId)
      : undefined

  const canDelete = user?.role === 'SUPER_ADMIN' || (user?.role === 'CHAPTER_ADMINISTRATOR' && user.chapterId === person.homeChapterId)

  return (
    <div>
      <PageHeader title={`${person.firstName} ${person.lastName}`} description={person.title ?? undefined} />
      <SavedBanner saved={saved === '1'} />

      <PersonForm action={updatePerson.bind(null, person.id)} person={person} organizations={organizations} chapters={chapters} lockedChapter={lockedChapter} />

      <div className="mt-10 max-w-3xl border border-border-subtle p-6">
        <h2 className="font-serif text-lg text-brand-primary">Relationships</h2>
        <p className="mt-1 font-sans text-xs text-ink-muted">
          One Person, many roles. Everything below points back at this single record — nothing here is a duplicate.
        </p>

        <div className="mt-6">
          <h3 className="font-sans text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: '0.05em' }}>Standing Affiliations</h3>
          {person.affiliations.length === 0 ? (
            <p className="mt-2 font-sans text-sm text-ink-muted">No affiliations recorded.</p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {person.affiliations.map((a) => (
                <div key={a.id} className="flex items-center justify-between border-t border-border-subtle py-2 first:border-t-0">
                  <span className="font-sans text-sm text-ink">
                    {AFFILIATION_LABELS[a.affiliationType] ?? a.affiliationType}
                    {a.relatedChapter && <span className="text-ink-muted"> — {a.relatedChapter.name}</span>}
                    {a.relatedOrganization && <span className="text-ink-muted"> — {a.relatedOrganization.name}</span>}
                    {a.relatedProgram && <span className="text-ink-muted"> — {a.relatedProgram.title}</span>}
                  </span>
                  <Badge tone={a.status === 'ACTIVE' ? 'success' : 'muted'}>{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-sans text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: '0.05em' }}>Event Registrations</h3>
          {person.registrations.length === 0 ? (
            <p className="mt-2 font-sans text-sm text-ink-muted">No event registrations.</p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {person.registrations.map((r) => (
                <div key={r.id} className="flex items-center justify-between border-t border-border-subtle py-2 first:border-t-0">
                  <span className="font-sans text-sm text-ink">{r.event.title} <span className="text-ink-muted">— {formatDate(r.event.startDate)}</span></span>
                  <Badge tone={r.status === 'ATTENDED' || r.status === 'CHECKED_IN' ? 'success' : 'default'}>{r.status.replace(/_/g, ' ')}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-sans text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: '0.05em' }}>Program Applications</h3>
          {person.applications.length === 0 ? (
            <p className="mt-2 font-sans text-sm text-ink-muted">No program applications.</p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {person.applications.map((a) => (
                <div key={a.id} className="flex items-center justify-between border-t border-border-subtle py-2 first:border-t-0">
                  <span className="font-sans text-sm text-ink">{a.program.title}</span>
                  <Badge tone={a.status === 'ACCEPTED' || a.status === 'ENROLLED' ? 'success' : 'default'}>{a.status.replace(/_/g, ' ')}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-sans text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: '0.05em' }}>Speaking Appearances</h3>
          {person.speakerAppearances.length === 0 ? (
            <p className="mt-2 font-sans text-sm text-ink-muted">No speaking appearances.</p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {person.speakerAppearances.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-t border-border-subtle py-2 first:border-t-0">
                  <Link href={`/admin/events/${s.eventId}`} className="font-sans text-sm text-brand-primary underline-offset-4 hover:underline">{s.event.title}</Link>
                  <span className="font-sans text-xs text-ink-muted">{formatDate(s.event.startDate)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {canDelete && (
        <form action={deletePerson.bind(null, person.id)} className="mt-8">
          <SubmitButton variant="danger">Delete Person</SubmitButton>
        </form>
      )}
    </div>
  )
}
