import { prisma } from '@/lib/db'
import { slugify } from '@/lib/format'
import type { FormFieldConfig } from '@/lib/forms'
import type { PillarTag } from '@prisma/client'

// Shared by the public registration and application Server Actions. Kept out
// of those 'use server' files on purpose: every export there becomes a
// callable endpoint, and these helpers shouldn't be.

export type FormResponses = Record<string, string | boolean>

const PILLAR_MAP: Record<string, PillarTag> = {
  Educator: 'EDUCATOR',
  Leader: 'LEADER',
  Entrepreneur: 'ENTREPRENEUR',
  Creative: 'CREATIVE',
  Technocrat: 'TECHNOCRAT',
}

/** Reads every configured field out of the submission, enforcing `required`. */
export function readResponses(
  fields: FormFieldConfig[],
  formData: FormData,
): { ok: true; responses: FormResponses } | { ok: false; message: string } {
  const responses: FormResponses = {}

  for (const field of fields) {
    if (field.type === 'checkbox' || field.type === 'consent') {
      const checked = formData.get(field.id) === 'on'
      if (field.required && !checked) {
        return { ok: false, message: `Please confirm: ${field.label}` }
      }
      responses[field.id] = checked
    } else if (field.type === 'file') {
      const file = formData.get(field.id)
      // File storage is not wired to persistent object storage in this pass —
      // we record the filename so the submission is real, not silently dropped.
      responses[field.id] = file instanceof File && file.size > 0 ? file.name : ''
    } else {
      const value = (formData.get(field.id) as string | null)?.trim() ?? ''
      if (field.required && !value) {
        return { ok: false, message: `${field.label} is required.` }
      }
      responses[field.id] = value
    }
  }

  return { ok: true, responses }
}

function pick(fields: FormFieldConfig[], responses: FormResponses, match: (field: FormFieldConfig) => boolean): string {
  const field = fields.find(match)
  const value = field ? responses[field.id] : undefined
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Seeded forms use fixed ids (`email`, `fullName`, …), but fields added in the
 * Form Builder get random ids. So each detail is looked up by its conventional
 * id first, then by field type — or by label for names, which are plain text.
 */
export function contactDetails(fields: FormFieldConfig[], responses: FormResponses) {
  const byLabel = (pattern: RegExp) => (field: FormFieldConfig) => field.type === 'text' && pattern.test(field.label)

  let fullName = pick(fields, responses, (f) => f.id === 'fullName')
  if (!fullName) {
    const first = pick(fields, responses, byLabel(/first\s*name|given\s*name/i))
    const last = pick(fields, responses, byLabel(/last\s*name|surname|family\s*name/i))
    fullName =
      [first, last].filter(Boolean).join(' ') ||
      pick(fields, responses, (f) => byLabel(/name/i)(f) && !/organi[sz]ation|company|church|ministry/i.test(f.label))
  }

  return {
    email: (pick(fields, responses, (f) => f.id === 'email') || pick(fields, responses, (f) => f.type === 'email')).toLowerCase(),
    fullName,
    phone: pick(fields, responses, (f) => f.id === 'phone') || pick(fields, responses, (f) => f.type === 'phone'),
    country: pick(fields, responses, (f) => f.id === 'country') || pick(fields, responses, (f) => f.type === 'country'),
    pillar: pick(fields, responses, (f) => f.id === 'pillar') || pick(fields, responses, (f) => /pillar/i.test(f.label)),
  }
}

/** Person is the hub every submission hangs off — reuse one by email or create it. */
export async function findOrCreatePerson(contact: ReturnType<typeof contactDetails>) {
  const existing = await prisma.person.findUnique({ where: { email: contact.email } })
  if (existing) return existing

  const [firstName, ...rest] = contact.fullName.split(' ').filter(Boolean)
  const lastName = rest.join(' ') || '—'
  const pillarValue = PILLAR_MAP[contact.pillar]

  return prisma.person.create({
    data: {
      firstName: firstName || contact.fullName || 'Guest',
      lastName,
      slug: slugify(`${firstName || 'guest'}-${lastName}-${Date.now().toString(36)}`),
      email: contact.email,
      phone: contact.phone || undefined,
      country: contact.country || undefined,
      pillarTags: pillarValue ? [pillarValue] : [],
    },
  })
}
