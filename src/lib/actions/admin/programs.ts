'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { slugify } from '@/lib/format'
import type { PillarTag, ProgramStatus } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function programPayload(formData: FormData) {
  return {
    title: str(formData, 'title'),
    slug: slugify(str(formData, 'slug') || str(formData, 'title')),
    summary: str(formData, 'summary'),
    description: str(formData, 'description'),
    pillarTags: formData.getAll('pillarTags') as PillarTag[],
    status: str(formData, 'status') as ProgramStatus,
    programManagerId: str(formData, 'programManagerId') || null,
    featuredOnHomepage: formData.get('featuredOnHomepage') === 'on',
    seoTitle: str(formData, 'seoTitle') || null,
    seoDescription: str(formData, 'seoDescription') || null,
  }
}

export async function createProgram(formData: FormData) {
  await requireUser(['PROGRAM_MANAGER'])
  const program = await prisma.program.create({ data: programPayload(formData) })
  revalidatePath('/programs')
  revalidatePath('/admin/programs')
  redirect(`/admin/programs/${program.id}?saved=1`)
}

export async function updateProgram(programId: string, formData: FormData) {
  await requireUser(['PROGRAM_MANAGER'])
  const existing = await prisma.program.findUniqueOrThrow({ where: { id: programId } })
  await prisma.program.update({ where: { id: programId }, data: programPayload(formData) })
  revalidatePath('/programs')
  revalidatePath(`/programs/${existing.slug}`)
  revalidatePath('/admin/programs')
  revalidatePath(`/admin/programs/${programId}`)
  redirect(`/admin/programs/${programId}?saved=1`)
}

export async function deleteProgram(programId: string) {
  await requireUser(['PROGRAM_MANAGER'])
  await prisma.program.delete({ where: { id: programId } })
  revalidatePath('/programs')
  revalidatePath('/admin/programs')
  redirect('/admin/programs?deleted=1')
}

export async function addCohortToProgram(programId: string, formData: FormData) {
  await requireUser(['PROGRAM_MANAGER'])
  const name = str(formData, 'name')
  const startDate = str(formData, 'startDate')
  const endDate = str(formData, 'endDate')
  const capacity = str(formData, 'capacity')

  if (name) {
    await prisma.cohort.create({
      data: {
        programId,
        name,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        capacity: capacity ? Number(capacity) : null,
      },
    })
  }

  revalidatePath(`/admin/programs/${programId}`)
  redirect(`/admin/programs/${programId}?saved=1`)
}
