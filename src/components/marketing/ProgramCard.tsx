import Link from 'next/link'

const STATUS_LABELS: Record<string, string> = {
  OPEN_FOR_APPLICATIONS: 'Applications Open', ONGOING: 'Ongoing', CLOSED: 'Closed', ARCHIVED: 'Archived',
}

export function ProgramCard({
  program,
}: {
  program: { title: string; slug: string; summary: string; status: string }
}) {
  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex flex-col justify-between border border-border-subtle p-8 transition-colors hover:border-brand-accent"
    >
      <div>
        <p className="font-sans text-xs font-semibold uppercase text-brand-secondary" style={{ letterSpacing: 'var(--tracking-label)' }}>
          {STATUS_LABELS[program.status] ?? program.status}
        </p>
        <h3 className="mt-3 font-serif text-2xl font-medium leading-snug text-brand-primary transition-colors group-hover:text-brand-accent">
          {program.title}
        </h3>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">{program.summary}</p>
      </div>
      <span
        className="mt-8 font-sans text-xs font-semibold uppercase text-brand-primary"
        style={{ letterSpacing: 'var(--tracking-label)' }}
      >
        Learn more →
      </span>
    </Link>
  )
}
