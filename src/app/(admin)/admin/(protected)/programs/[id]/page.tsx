import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateProgram, deleteProgram, addCohortToProgram } from '@/lib/actions/admin/programs'
import { PageHeader, SubmitButton, inputClasses, Field, th, td, tr } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { ProgramForm } from '@/components/admin/programs/ProgramForm'
import { formatDate } from '@/lib/format'

export default async function EditProgramPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const [program, programManagers] = await Promise.all([
    prisma.program.findUnique({
      where: { id },
      include: {
        cohorts: { orderBy: { startDate: 'asc' }, include: { _count: { select: { applications: true } } } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ['PROGRAM_MANAGER', 'SUPER_ADMIN'] }, active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  if (!program) notFound()

  return (
    <div>
      <PageHeader
        title={program.title}
        description={`${program._count.applications} application(s)`}
        actions={
          <Link
            href={`/admin/applications?program=${program.id}`}
            className="font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline"
            style={{ letterSpacing: '0.06em' }}
          >
            View Applications →
          </Link>
        }
      />
      <SavedBanner saved={saved === '1'} />

      <ProgramForm action={updateProgram.bind(null, program.id)} program={program} programManagers={programManagers} />

      <div className="mt-10 max-w-3xl border border-border-subtle p-6">
        <h2 className="font-serif text-lg text-brand-primary">Cohorts</h2>

        {program.cohorts.length === 0 ? (
          <p className="mt-4 font-sans text-sm text-ink-muted">No cohorts yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto border border-border-subtle">
            <table className="w-full min-w-[560px]">
              <thead className="bg-navy-50">
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Start</th>
                  <th className={th}>End</th>
                  <th className={th}>Capacity</th>
                  <th className={th}>Applications</th>
                </tr>
              </thead>
              <tbody>
                {program.cohorts.map((cohort) => (
                  <tr key={cohort.id} className={tr}>
                    <td className={td}>{cohort.name}</td>
                    <td className={td}>{cohort.startDate ? formatDate(cohort.startDate) : '—'}</td>
                    <td className={td}>{cohort.endDate ? formatDate(cohort.endDate) : '—'}</td>
                    <td className={td}>{cohort.capacity ?? '—'}</td>
                    <td className={td}>{cohort._count.applications}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form action={addCohortToProgram.bind(null, program.id)} className="mt-6 flex flex-wrap items-end gap-3">
          <div className="w-44">
            <Field label="Name" htmlFor="name" required>
              <input id="name" name="name" required className={inputClasses} />
            </Field>
          </div>
          <div className="w-40">
            <Field label="Start Date" htmlFor="startDate">
              <input id="startDate" name="startDate" type="date" className={inputClasses} />
            </Field>
          </div>
          <div className="w-40">
            <Field label="End Date" htmlFor="endDate">
              <input id="endDate" name="endDate" type="date" className={inputClasses} />
            </Field>
          </div>
          <div className="w-28">
            <Field label="Capacity" htmlFor="capacity">
              <input id="capacity" name="capacity" type="number" min={0} className={inputClasses} />
            </Field>
          </div>
          <SubmitButton>Add Cohort</SubmitButton>
        </form>
      </div>

      <form action={deleteProgram.bind(null, program.id)} className="mt-8">
        <SubmitButton variant="danger">Delete Program</SubmitButton>
      </form>
    </div>
  )
}
