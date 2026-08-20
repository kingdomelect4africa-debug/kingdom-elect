'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { slugify } from '@/lib/format'
import type { OrganizationType } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function organizationPayload(formData: FormData) {
  return {
    name: str(formData, 'name'),
    slug: slugify(str(formData, 'slug') || str(formData, 'name')),
    type: str(formData, 'type') as OrganizationType,
    website: str(formData, 'website') || null,
    description: str(formData, 'description') || null,
    country: str(formData, 'country') || null,
    primaryContactId: str(formData, 'primaryContactId') || null,
    partnershipTier: str(formData, 'partnershipTier') || null,
    featuredOnHomepage: formData.get('featuredOnHomepage') === 'on',
    seoTitle: str(formData, 'seoTitle') || null,
    seoDescription: str(formData, 'seoDescription') || null,
  }
}

export async function createOrganization(formData: FormData) {
  await requireUser(['CHAPTER_ADMINISTRATOR'])
  const organization = await prisma.organization.create({ data: organizationPayload(formData) })
  revalidatePath('/partners')
  revalidatePath('/admin/organizations')
  redirect(`/admin/organizations/${organization.id}?saved=1`)
}

export async function updateOrganization(organizationId: string, formData: FormData) {
  await requireUser(['CHAPTER_ADMINISTRATOR'])
  await prisma.organization.update({ where: { id: organizationId }, data: organizationPayload(formData) })
  revalidatePath('/partners')
  revalidatePath('/admin/organizations')
  revalidatePath(`/admin/organizations/${organizationId}`)
  redirect(`/admin/organizations/${organizationId}?saved=1`)
}

export async function deleteOrganization(organizationId: string) {
  await requireUser(['CHAPTER_ADMINISTRATOR'])
  await prisma.organization.delete({ where: { id: organizationId } })
  revalidatePath('/partners')
  revalidatePath('/admin/organizations')
  redirect('/admin/organizations?deleted=1')
}
