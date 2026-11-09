import { LinkArrow } from '@/components/ui/Section'
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
    <div className="group relative border-t border-line py-[1.4rem] transition-[padding] duration-500 ease-[var(--ease-signature)] first-of-type:border-t-0 hover:pl-5">
      <span
        className="absolute bottom-[1.4rem] left-0 top-[1.4rem] w-[2px] origin-top scale-y-0 bg-gold transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-y-100"
        aria-hidden="true"
      />
      <span className="font-sans text-[0.68rem] font-bold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
        {TYPE_LABELS[event.type] ?? event.type}
      </span>
      <h4 className="mt-1 font-serif text-[1.05rem] font-semibold text-ink transition-colors duration-300 group-hover:text-gold-dark">{event.title}</h4>
      <p className="mt-2 font-sans text-[0.88rem] text-body">{event.summary}</p>
      <div className="mt-[0.9rem] flex items-center gap-[0.9rem] font-sans text-[0.78rem] text-body">
        {formatDateRange(event.startDate, event.endDate)} · {event.isVirtual ? 'Virtual' : event.venueCity ?? 'TBA'}
      </div>
      <div className="mt-3">
        <LinkArrow href={`/events/${event.slug}`}>Learn more</LinkArrow>
      </div>
    </div>
  )
}
