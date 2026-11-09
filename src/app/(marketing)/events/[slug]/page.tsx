import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { SetNavTone } from '@/components/marketing/NavTone'
import { HeroFacts, PageHero } from '@/components/marketing/PageHero'
import { Reveal } from '@/components/motion/primitives'
import { RegistrationForm } from '@/components/marketing/forms/RegistrationForm'
import { ArticleCard } from '@/components/marketing/ArticleCard'
import { formatDateRange, countryName } from '@/lib/format'
import type { FormFieldConfig } from '@/lib/forms'

export const revalidate = 30

const TYPE_LABELS: Record<string, string> = {
  SITUATION_ROOM: 'The Situation Room',
  REGIONAL_SUMMIT: 'Regional Summit',
  CHAPTER_MEETUP: 'Chapter Meetup',
  WEBINAR: 'Webinar',
  TRAINING: 'Training',
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
      <SetNavTone tone="dark" />
      <PageHero id="event" eyebrow={TYPE_LABELS[event.type] ?? event.type} title={event.title} intro={event.summary} motif="arcs">
        <HeroFacts
          facts={[
            { label: 'Dates', value: formatDateRange(event.startDate, event.endDate) },
            {
              label: 'Location',
              value: event.isVirtual
                ? 'Virtual'
                : [event.venueName, event.venueCity, countryName(event.venueCountry)].filter(Boolean).join(', ') || 'To be announced',
            },
            ...(event.capacity ? [{ label: 'Capacity', value: `${event.capacity} delegates` }] : []),
          ]}
        />
      </PageHero>

      <section className="bg-ivory py-[clamp(4rem,8vw,6.5rem)]">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="font-serif text-2xl font-semibold text-ink">Overview</h2>
                <p className="mt-4 whitespace-pre-line font-sans leading-[1.8] text-body">{event.description}</p>
              </Reveal>

              {event.speakers.length > 0 && (
                <Reveal className="mt-16">
                  <h2 className="font-serif text-2xl font-semibold text-ink">Speakers</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {event.speakers.map((speaker) => (
                      <div key={speaker.id} className="border-t border-line pt-4">
                        <p className="font-serif text-lg text-ink">
                          {speaker.person.firstName} {speaker.person.lastName}
                        </p>
                        <p className="mt-1 font-sans text-sm text-body">
                          {speaker.bioOverride ?? speaker.person.title ?? ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {event.sessions.length > 0 && (
                <Reveal className="mt-16">
                  <h2 className="font-serif text-2xl font-semibold text-ink">Agenda</h2>
                  <div className="mt-6 divide-y divide-line border-t border-line">
                    {event.sessions.map((session) => (
                      <div key={session.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-serif text-lg text-ink">{session.title}</p>
                          {session.track && (
                            <p className="font-sans text-xs uppercase text-body" style={{ letterSpacing: '0.06em' }}>
                              {session.track}
                            </p>
                          )}
                        </div>
                        <p className="font-sans text-sm text-body">
                          {new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' }).format(session.startTime)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {event.articles.length > 0 && (
                <Reveal className="mt-16">
                  <h2 className="font-serif text-2xl font-semibold text-ink">Related Intelligence</h2>
                  <div className="mt-4">
                    {event.articles.map((article) => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={0.1} amount={0.02} className="rounded-[var(--radius-md)] border border-line bg-ivory p-[1.75rem] shadow-[0_30px_70px_-45px_rgba(11,31,58,0.45)] lg:sticky lg:top-28">
                <h2 className="font-serif text-xl font-semibold text-ink">Register</h2>
                {event.registrationStatus === 'CLOSED' ? (
                  <p className="mt-4 font-sans text-sm text-body">Registration for this event is closed.</p>
                ) : registrationFields.length > 0 ? (
                  <div className="mt-6">
                    <RegistrationForm eventSlug={event.slug} fields={registrationFields} />
                  </div>
                ) : (
                  <p className="mt-4 font-sans text-sm text-body">Registration is not yet configured for this event.</p>
                )}
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
