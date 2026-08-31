'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? ''
}

export async function updateSiteSettings(formData: FormData) {
  await requireUser(['SUPER_ADMIN'])

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteName: str(formData, 'siteName'),
      tagline: str(formData, 'tagline'),
      contactEmail: str(formData, 'contactEmail') || null,
      supportEmail: str(formData, 'supportEmail') || null,
      contactPhone: str(formData, 'contactPhone') || null,
      address: str(formData, 'address') || null,
      footerText: str(formData, 'footerText') || null,
      defaultSeoTitle: str(formData, 'defaultSeoTitle') || null,
      defaultSeoDescription: str(formData, 'defaultSeoDescription') || null,
    },
    create: {
      id: 1,
      siteName: str(formData, 'siteName') || 'Kingdom E.L.E.C.T. for Africa',
      tagline: str(formData, 'tagline') || 'Building Influence. Transforming Africa.',
      contactEmail: str(formData, 'contactEmail') || null,
      supportEmail: str(formData, 'supportEmail') || null,
      contactPhone: str(formData, 'contactPhone') || null,
      address: str(formData, 'address') || null,
      footerText: str(formData, 'footerText') || null,
    },
  })

  revalidatePath('/', 'layout')
  revalidatePath('/admin/settings')
  redirect('/admin/settings?saved=1')
}

export async function updateHomePageContent(formData: FormData) {
  await requireUser(['CONTENT_EDITOR'])

  const momentStats = [0, 1, 2].map((i) => ({
    value: str(formData, `momentStats.${i}.value`),
    label: str(formData, `momentStats.${i}.label`),
  }))
  const frameworkSteps = [0, 1, 2, 3, 4].map((i) => ({
    label: str(formData, `frameworkSteps.${i}.label`),
    description: str(formData, `frameworkSteps.${i}.description`),
  }))

  await prisma.homePageContent.update({
    where: { id: 1 },
    data: {
      heroEyebrow: str(formData, 'heroEyebrow') || null,
      heroHeading: str(formData, 'heroHeading'),
      heroSubheading: str(formData, 'heroSubheading'),
      heroPrimaryCtaLabel: str(formData, 'heroPrimaryCtaLabel'),
      heroPrimaryCtaHref: str(formData, 'heroPrimaryCtaHref'),
      heroSecondaryCtaLabel: str(formData, 'heroSecondaryCtaLabel'),
      heroSecondaryCtaHref: str(formData, 'heroSecondaryCtaHref'),
      momentEyebrow: str(formData, 'momentEyebrow') || null,
      momentHeading: str(formData, 'momentHeading'),
      momentBody: str(formData, 'momentBody'),
      momentStats,
      frameworkHeading: str(formData, 'frameworkHeading'),
      frameworkIntro: str(formData, 'frameworkIntro'),
      frameworkSteps,
      fiveHeading: str(formData, 'fiveHeading'),
      fiveIntro: str(formData, 'fiveIntro'),
      situationRoomHeading: str(formData, 'situationRoomHeading'),
      situationRoomBody: str(formData, 'situationRoomBody'),
      intelligenceHeading: str(formData, 'intelligenceHeading'),
      intelligenceIntro: str(formData, 'intelligenceIntro'),
      participationHeading: str(formData, 'participationHeading'),
      participationBody: str(formData, 'participationBody'),
      participationCtaLabel: str(formData, 'participationCtaLabel'),
      participationCtaHref: str(formData, 'participationCtaHref'),
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/pages/home')
  redirect('/admin/pages/home?saved=1')
}

export async function updateAboutPageContent(formData: FormData) {
  await requireUser(['CONTENT_EDITOR'])

  const objectives = [0, 1, 2, 3, 4, 5].map((i) => ({
    title: str(formData, `objectives.${i}.title`),
    body: str(formData, `objectives.${i}.body`),
  }))
  const personality = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
    trait: str(formData, `personality.${i}.trait`),
  }))

  await prisma.aboutPageContent.update({
    where: { id: 1 },
    data: {
      heroHeading: str(formData, 'heroHeading'),
      heroBody: str(formData, 'heroBody'),
      storyHeading: str(formData, 'storyHeading'),
      storyBody: str(formData, 'storyBody'),
      visionStatement: str(formData, 'visionStatement'),
      missionStatement: str(formData, 'missionStatement'),
      purposeStatement: str(formData, 'purposeStatement'),
      essenceStatement: str(formData, 'essenceStatement'),
      objectives,
      personality,
    },
  })

  revalidatePath('/about')
  revalidatePath('/admin/pages/about')
  redirect('/admin/pages/about?saved=1')
}

export async function updateSituationRoomPageContent(formData: FormData) {
  await requireUser(['CONTENT_EDITOR'])

  const functions = [0, 1, 2, 3].map((i) => ({
    title: str(formData, `functions.${i}.title`),
    body: str(formData, `functions.${i}.body`),
  }))
  const sessionTypes = [0, 1, 2, 3, 4, 5, 6, 7]
    .map((i) => str(formData, `sessionTypes.${i}`))
    .filter(Boolean)
  const outcomes = [0, 1, 2, 3, 4, 5, 6]
    .map((i) => str(formData, `outcomes.${i}`))
    .filter(Boolean)
  const featuredEventId = str(formData, 'featuredEventId') || null

  await prisma.situationRoomPageContent.update({
    where: { id: 1 },
    data: {
      heroHeading: str(formData, 'heroHeading'),
      heroSubheading: str(formData, 'heroSubheading'),
      philosophyStatement: str(formData, 'philosophyStatement'),
      functions,
      sessionTypes,
      outcomes,
      featuredEventId,
    },
  })

  revalidatePath('/the-situation-room')
  revalidatePath('/admin/pages/situation-room')
  redirect('/admin/pages/situation-room?saved=1')
}

export async function updateTheFivePageContent(formData: FormData) {
  await requireUser(['CONTENT_EDITOR'])

  const keys = ['EDUCATOR', 'LEADER', 'ENTREPRENEUR', 'CREATIVE', 'TECHNOCRAT']
  const names = ['Educators', 'Leaders', 'Entrepreneurs', 'Creatives', 'Technocrats']
  const pillars = keys.map((key, i) => ({
    key,
    name: names[i],
    tagline: str(formData, `pillars.${i}.tagline`),
    body: str(formData, `pillars.${i}.body`),
    sphereOfInfluence: str(formData, `pillars.${i}.sphereOfInfluence`)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }))

  await prisma.theFivePageContent.update({
    where: { id: 1 },
    data: {
      heading: str(formData, 'heading'),
      intro: str(formData, 'intro'),
      pillars,
    },
  })

  revalidatePath('/the-five')
  revalidatePath('/admin/pages/the-five')
  redirect('/admin/pages/the-five?saved=1')
}
