'use server'

import { prisma } from '@/lib/db'
import { slugify } from '@/lib/format'
import { sendSituationRoomTierEmails } from '@/lib/email'
import {
  ACCESS_TIERS,
  TIER_EVENT_SLUG,
  asksAccommodation,
  cleanTierAnswers,
  displaySector,
  validateTierAnswers,
  type AccessTier,
  type TierErrors,
} from '@/lib/situation-room-tiers'

export type TierSubmitResult = { success: true } | { success: false; message: string; errors?: TierErrors }

export async function submitSituationRoomTierRegistration(tier: AccessTier, raw: unknown): Promise<TierSubmitResult> {
  if (!ACCESS_TIERS.includes(tier)) return { success: false, message: 'This registration link is not valid.' }

  const answers = cleanTierAnswers(raw)
  const errors = validateTierAnswers(answers, tier)
  if (Object.keys(errors).length > 0) return { success: false, message: 'Please check the highlighted answers.', errors }

  const event = await prisma.event.findUnique({ where: { slug: TIER_EVENT_SLUG } })
  if (!event) return { success: false, message: 'This event could not be found. Please contact the organizing team.' }
  if (event.registrationStatus === 'CLOSED') return { success: false, message: 'Registration for this event is closed.' }

  const contactNumber = `${answers.phone_country} ${answers.phone_number}`
  const [firstName, ...rest] = answers.full_name.split(' ').filter(Boolean)
  const lastName = rest.join(' ') || '—'

  // This form is public, so it never overwrites details on an existing person.
  // What they typed is kept on the registration itself.
  const person = await prisma.person.upsert({
    where: { email: answers.email },
    update: {},
    create: {
      firstName,
      lastName,
      slug: slugify(`${firstName}-${lastName}-${Date.now().toString(36)}`),
      email: answers.email,
      phone: contactNumber,
    },
  })
  if (!person.phone) {
    await prisma.person.update({ where: { id: person.id }, data: { phone: contactNumber } })
  }

  const registration = await prisma.registration.create({
    data: {
      eventId: event.id,
      personId: person.id,
      status: 'REGISTERED',
      responses: {
        access_tier: tier,
        full_name: answers.full_name,
        email: answers.email,
        contact_number: contactNumber,
        gender: answers.gender,
        sector: displaySector(answers),
        business_niche: answers.business_niche,
        ...(asksAccommodation(tier)
          ? { needs_accommodation: answers.needs_accommodation, spouse_attending: answers.spouse_attending }
          : {}),
        willing_to_partner: answers.willing_to_partner,
        submitted_at: new Date().toISOString(),
      },
    },
  })

  await sendSituationRoomTierEmails(tier, answers, registration.id)

  return { success: true }
}
