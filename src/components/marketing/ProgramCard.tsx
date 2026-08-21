import { LinkArrow } from '@/components/ui/Section'

const STATUS_LABELS: Record<string, string> = {
  OPEN_FOR_APPLICATIONS: 'Applications Open', ONGOING: 'Ongoing', CLOSED: 'Closed', ARCHIVED: 'Archived',
}

export function ProgramCard({
  program,
}: {
  program: { title: string; slug: string; summary: string; status: string }
}) {
  return (
    <div className="border-t border-line py-[1.4rem] first-of-type:border-t-0">
      <span className="font-sans text-[0.68rem] font-bold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
        {STATUS_LABELS[program.status] ?? program.status}
      </span>
      <h4 className="mt-1 font-serif text-[1.05rem] font-semibold text-ink">{program.title}</h4>
      <p className="mt-2 font-sans text-[0.88rem] text-body">{program.summary}</p>
      <div className="mt-[0.9rem]">
        <LinkArrow href={`/programs/${program.slug}`}>Learn more</LinkArrow>
      </div>
    </div>
  )
}
