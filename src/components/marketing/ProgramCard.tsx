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
    <div className="group relative border-t border-line py-[1.4rem] transition-[padding] duration-500 ease-[var(--ease-signature)] first-of-type:border-t-0 hover:pl-5">
      <span
        className="absolute bottom-[1.4rem] left-0 top-[1.4rem] w-[2px] origin-top scale-y-0 bg-gold transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-y-100"
        aria-hidden="true"
      />
      <span className="font-sans text-[0.68rem] font-bold uppercase text-emerald" style={{ letterSpacing: '0.1em' }}>
        {STATUS_LABELS[program.status] ?? program.status}
      </span>
      <h4 className="mt-1 font-serif text-[1.05rem] font-semibold text-ink transition-colors duration-300 group-hover:text-gold-dark">{program.title}</h4>
      <p className="mt-2 font-sans text-[0.88rem] text-body">{program.summary}</p>
      <div className="mt-[0.9rem]">
        <LinkArrow href={`/programs/${program.slug}`}>Learn more</LinkArrow>
      </div>
    </div>
  )
}
