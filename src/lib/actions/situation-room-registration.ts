'use server'

import { prisma } from '@/lib/db'
import { slugify } from '@/lib/format'
import { sendSituationRoomEmails } from '@/lib/email'
import type { Answers } from '@/components/marketing/situation-room/register/steps'

const EVENT_SLUG = 'the-situation-room-2026'

export type SubmitResult = { success: true } | { success: false; message: string }

function required(value: string, label: string): string | null {
  return value.trim() ? null : `${label} is required.`
}

export async function submitSituationRoomRegistration(answers: Answers): Promise<SubmitResult> {
  const email = answers.email.trim().toLowerCase()
  const fullName = answers.full_name.trim()

  const checks = [
    required(email, 'Email address'),
    required(fullName, 'Full name'),
    required(answers.phone_number, 'Phone number'),
    required(answers.city_of_residence, 'City of residence'),
    required(answers.occupation_role, 'Occupation / role'),
    required(answers.organization_name, 'Organization / business name'),
    required(answers.industry_sector, 'Industry / sector'),
    required(answers.years_experience, 'Years of experience'),
    required(answers.kingdom_understanding, 'Kingdom stewardship understanding'),
    required(answers.motivation, 'Motivation'),
    required(answers.value_offered, 'Value offered'),
    required(answers.abuja_influence, 'Abuja influence'),
    answers.self_identification.length === 0 ? 'Please select at least one option.' : null,
    required(answers.commit_full_participation, 'Participation commitment'),
    required(answers.accommodation_subscribe, 'Accommodation subscription'),
    required(answers.invitation_requested, 'Invitation request'),
    required(answers.donation_interest, 'Donation interest'),
    answers.access_protocol_agreed ? null : 'Please confirm you understand the access process.',
    !/^\S+@\S+\.\S+$/.test(email) ? 'Please enter a valid email address.' : null,
  ]
  const firstError = checks.find((c): c is string => c !== null)
  if (firstError) return { success: false, message: firstError }

  const event = await prisma.event.findUnique({ where: { slug: EVENT_SLUG } })
  if (!event) return { success: false, message: 'This event could not be found. Please contact the organizing team.' }
  if (event.registrationStatus === 'CLOSED') {
    return { success: false, message: 'Registration for this event is closed.' }
  }

  let person = await prisma.person.findUnique({ where: { email } })
  const [firstName, ...rest] = fullName.split(' ').filter(Boolean)
  const lastName = rest.join(' ') || '—'

  if (!person) {
    person = await prisma.person.create({
      data: {
        firstName: firstName || fullName || 'Guest',
        lastName,
        slug: slugify(`${firstName || 'guest'}-${lastName}-${Date.now().toString(36)}`),
        email,
        phone: `${answers.phone_country} ${answers.phone_number}`.trim(),
        title: answers.occupation_role || undefined,
      },
    })
  } else {
    person = await prisma.person.update({
      where: { id: person.id },
      data: {
        phone: `${answers.phone_country} ${answers.phone_number}`.trim(),
        title: person.title ?? answers.occupation_role ?? undefined,
      },
    })
  }

  const responses = {
    email,
    full_name: fullName,
    phone_whatsapp: `${answers.phone_country} ${answers.phone_number}`.trim(),
    city_of_residence: answers.city_of_residence.trim(),
    occupation_role: answers.occupation_role.trim(),
    organization_name: answers.organization_name.trim(),
    industry_sector: answers.industry_sector === 'Other' ? answers.industry_sector_other.trim() || 'Other' : answers.industry_sector,
    years_experience: answers.years_experience,
    kingdom_understanding: answers.kingdom_understanding.trim(),
    motivation: answers.motivation.trim(),
    value_offered: answers.value_offered.trim(),
    abuja_influence: answers.abuja_influence,
    self_identification: answers.self_identification.includes('Other') && answers.self_identification_other.trim()
      ? [...answers.self_identification.filter((v) => v !== 'Other'), `Other: ${answers.self_identification_other.trim()}`]
      : answers.self_identification,
    networks_boards: answers.networks_boards.trim() || null,
    commit_full_participation: answers.commit_full_participation,
    accommodation_subscribe: answers.accommodation_subscribe,
    spouse_attending: answers.accommodation_subscribe === 'Yes' ? answers.spouse_attending || null : null,
    access_protocol_agreed: answers.access_protocol_agreed,
    invitation_requested: answers.invitation_requested,
    donation_interest: answers.donation_interest,
    donation_pledge: answers.donation_interest === 'Yes' ? answers.donation_pledge.trim() || null : null,
    submitted_at: new Date().toISOString(),
  }

  const registration = await prisma.registration.create({
    data: {
      eventId: event.id,
      personId: person.id,
      responses,
      status: 'REGISTERED',
    },
  })

  await sendSituationRoomEmails(answers, registration.id)

  return { success: true }
}
