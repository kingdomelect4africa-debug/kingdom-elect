import Link from 'next/link'
import { formatDateRange } from '@/lib/format'

const TYPE_LABELS: Record<string, string> = {
  SITUATION_ROOM: 'The Situation Room', REGIONAL_SUMMIT: 'Regional Summit',
  CHAPTER_MEETUP: 'Chapter Meetup', WEBINAR: 'Webinar', TRAINING: 'Training',
}

export function EventCard({
  event,
}: {
  event: {
    title: string; slug: string; type: string; summary: string
    startDate: Date; endDate: Date; venueCity: string | null; venueCountry: string | null
    isVirtual: boolean; registrationStatus: string
  }
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col justify-between border border-border-subtle p-8 transition-colors hover:border-brand-accent"
    >
      <div>
        <p className="font-sans text-xs font-semibold uppercase text-brand-secondary" style={{ letterSpacing: 'var(--tracking-label)' }}>
          {TYPE_LABELS[event.type] ?? event.type}
        </p>
        <h3 className="mt-3 font-serif text-2xl font-medium leading-snug text-brand-primary transition-colors group-hover:text-brand-accent">
          {event.title}
        </h3>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">{event.summary}</p>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-4 font-sans text-xs uppercase text-ink-muted" style={{ letterSpacing: '0.06em' }}>
        <span>{formatDateRange(event.startDate, event.endDate)}</span>
        <span>{event.isVirtual ? 'Virtual' : event.venueCity ?? ''}</span>
      </div>
    </Link>
  )
}
