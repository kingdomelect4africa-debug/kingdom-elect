import { prisma } from '@/lib/db'
import { createProgram } from '@/lib/actions/admin/programs'
import { PageHeader } from '@/components/admin/ui'
import { ProgramForm } from '@/components/admin/programs/ProgramForm'

export default async function NewProgramPage() {
  const programManagers = await prisma.user.findMany({
    where: { role: { in: ['PROGRAM_MANAGER', 'SUPER_ADMIN'] }, active: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div>
      <PageHeader title="Create Program" />
      <ProgramForm action={createProgram} programManagers={programManagers} />
    </div>
  )
}
