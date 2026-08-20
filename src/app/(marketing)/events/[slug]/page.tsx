import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Section'
import { RegistrationForm } from '@/components/marketing/forms/RegistrationForm'
import { ArticleCard } from '@/components/marketing/ArticleCard'
import { formatDateRange } from '@/lib/format'
import type { FormFieldConfig } from '@/lib/forms'

export const revalidate = 30

const TYPE_LABELS: Record<string, string> = {
  SITUATION_ROOM: 'The Situation Room', REGIONAL_SUMMIT: 'Regional Summit',
  CHAPTER_MEETUP: 'Chapter Meetup', WEBINAR: 'Webinar', TRAINING: 'Training',
}

async function getEvent(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      registrationForm: true,
      speakers: { include: { person: true, organizationOverride: true } },
      sessions: { orderBy: { startTime: 'asc' }, include: { speakers: { include: { person: true } } } },
      articles: { where: { status: 'PUBLISHED' }, take: 3 },
    },
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return {}
  return {
    title: event.seoTitle ?? event.title,
    description: event.seoDescription ?? event.summary,
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const registrationFields = event.registrationForm
    ? ((event.registrationForm.fields as unknown as FormFieldConfig[]) ?? [])
    : []

  return (
    <>
      <section className="bg-brand-primary pb-16 pt-40 text-ink-inverse md:pt-48">
        <Container>
          <Eyebrow>{TYPE_LABELS[event.type] ?? event.type}</Eyebrow>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl">
            {event.title}
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-ivory-500/85">{event.summary}</p>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-white/15 pt-8 font-sans text-sm">
            <div>
              <p className="text-xs uppercase text-ivory-700" style={{ letterSpacing: '0.06em' }}>When</p>
              <p className="mt-1 text-ivory-500">{formatDateRange(event.startDate, event.endDate)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-ivory-700" style={{ letterSpacing: '0.06em' }}>Where</p>
              <p className="mt-1 text-ivory-500">
                {event.isVirtual ? 'Virtual' : [event.venueName, event.venueCity, event.venueCountry].filter(Boolean).join(', ') || 'To be announced'}
              </p>
            </div>
            {event.capacity && (
              <div>
                <p className="text-xs uppercase text-ivory-700" style={{ letterSpacing: '0.06em' }}>Capacity</p>
                <p className="mt-1 text-ivory-500">{event.capacity} delegates</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-24 md:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-serif text-2xl font-medium text-brand-primary">Overview</h2>
              <p className="mt-4 whitespace-pre-line font-sans text-base leading-relaxed text-ink">{event.description}</p>

              {event.speakers.length > 0 && (
                <div className="mt-16">
                  <h2 className="font-serif text-2xl font-medium text-brand-primary">Speakers</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {event.speakers.map((speaker) => (
                      <div key={speaker.id} className="border-t border-border-subtle pt-4">
                        <p className="font-serif text-lg text-brand-primary">
                          {speaker.person.firstName} {speaker.person.lastName}
                        </p>
                        <p className="mt-1 font-sans text-sm text-ink-muted">
                          {speaker.bioOverride ?? speaker.person.title ?? ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.sessions.length > 0 && (
                <div className="mt-16">
                  <h2 className="font-serif text-2xl font-medium text-brand-primary">Agenda</h2>
                  <div className="mt-6 divide-y divide-border-subtle border-t border-border-subtle">
                    {event.sessions.map((session) => (
                      <div key={session.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-serif text-lg text-brand-primary">{session.title}</p>
                          {session.track && <p className="font-sans text-xs uppercase text-ink-muted">{session.track}</p>}
                        </div>
                        <p className="font-sans text-sm text-ink-muted">
                          {new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' }).format(session.startTime)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.articles.length > 0 && (
                <div className="mt-16">
                  <h2 className="font-serif text-2xl font-medium text-brand-primary">Related Intelligence</h2>
                  <div className="mt-4">
                    {event.articles.map((article) => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="border border-border-strong p-8">
                <h2 className="font-serif text-xl font-medium text-brand-primary">Register</h2>
                {event.registrationStatus === 'CLOSED' ? (
                  <p className="mt-4 font-sans text-sm text-ink-muted">Registration for this event is closed.</p>
                ) : registrationFields.length > 0 ? (
                  <div className="mt-6">
                    <RegistrationForm eventSlug={event.slug} fields={registrationFields} />
                  </div>
                ) : (
                  <p className="mt-4 font-sans text-sm text-ink-muted">Registration is not yet configured for this event.</p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
