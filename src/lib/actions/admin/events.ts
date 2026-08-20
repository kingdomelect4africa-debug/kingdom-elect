'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { slugify } from '@/lib/format'
import type { EventLifecycleStatus, EventRegistrationStatus, EventType } from '@prisma/client'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

function eventPayload(formData: FormData) {
  return {
    title: str(formData, 'title'),
    slug: slugify(str(formData, 'slug') || str(formData, 'title')),
    type: str(formData, 'type') as EventType,
    summary: str(formData, 'summary'),
    description: str(formData, 'description'),
    startDate: new Date(str(formData, 'startDate')),
    endDate: new Date(str(formData, 'endDate')),
    timezone: str(formData, 'timezone') || 'Africa/Lagos',
    venueName: str(formData, 'venueName') || null,
    venueCity: str(formData, 'venueCity') || null,
    venueCountry: str(formData, 'venueCountry') || null,
    isVirtual: formData.get('isVirtual') === 'on',
    virtualLink: str(formData, 'virtualLink') || null,
    capacity: str(formData, 'capacity') ? Number(str(formData, 'capacity')) : null,
    registrationStatus: str(formData, 'registrationStatus') as EventRegistrationStatus,
    status: str(formData, 'status') as EventLifecycleStatus,
    featuredOnHomepage: formData.get('featuredOnHomepage') === 'on',
    registrationFormId: str(formData, 'registrationFormId') || null,
    chapterId: str(formData, 'chapterId') || null,
    seoTitle: str(formData, 'seoTitle') || null,
    seoDescription: str(formData, 'seoDescription') || null,
  }
}

export async function createEvent(formData: FormData) {
  await requireUser(['EVENTS_MANAGER'])
  const event = await prisma.event.create({ data: eventPayload(formData) })
  revalidatePath('/events')
  revalidatePath('/admin/events')
  redirect(`/admin/events/${event.id}?saved=1`)
}

export async function updateEvent(eventId: string, formData: FormData) {
  await requireUser(['EVENTS_MANAGER'])
  const existing = await prisma.event.findUniqueOrThrow({ where: { id: eventId } })
  await prisma.event.update({ where: { id: eventId }, data: eventPayload(formData) })
  revalidatePath('/events')
  revalidatePath(`/events/${existing.slug}`)
  revalidatePath('/admin/events')
  revalidatePath(`/admin/events/${eventId}`)
  redirect(`/admin/events/${eventId}?saved=1`)
}

export async function deleteEvent(eventId: string) {
  await requireUser(['EVENTS_MANAGER'])
  await prisma.event.delete({ where: { id: eventId } })
  revalidatePath('/events')
  revalidatePath('/admin/events')
  redirect('/admin/events?deleted=1')
}

export async function addSpeakerToEvent(eventId: string, formData: FormData) {
  await requireUser(['EVENTS_MANAGER'])
  const personId = str(formData, 'personId')
  if (personId) {
    await prisma.speaker.upsert({
      where: { eventId_personId: { eventId, personId } },
      update: {},
      create: { eventId, personId },
    })
  }
  revalidatePath(`/admin/events/${eventId}`)
  revalidatePath('/events')
  redirect(`/admin/events/${eventId}?saved=1`)
}

export async function removeSpeakerFromEvent(eventId: string, speakerId: string) {
  await requireUser(['EVENTS_MANAGER'])
  await prisma.speaker.delete({ where: { id: speakerId } })
  revalidatePath(`/admin/events/${eventId}`)
  revalidatePath('/events')
  redirect(`/admin/events/${eventId}?saved=1`)
}
