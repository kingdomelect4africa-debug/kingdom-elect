import { Prisma, type FormDefinition } from '@prisma/client'
import { prisma } from '@/lib/db'
import { ADMIN_NOTIFICATION_EMAIL } from '@/lib/email'
import type { FormFieldConfig } from '@/lib/forms'
import {
  ACCESS_TIERS,
  TIER_CONFIRMATION_MESSAGE,
  defaultTierFields,
  tierFormName,
  type AccessTier,
} from '@/lib/situation-room-tiers'

/**
 * The FormDefinition behind a VVIP or VIP page. It's created with the original
 * questions the first time anything asks for it, so the pages and the Form
 * Builder work on any database without a separate setup step.
 */
export async function getTierForm(tier: AccessTier): Promise<FormDefinition> {
  const existing = await prisma.formDefinition.findUnique({ where: { accessTier: tier } })
  if (existing) return existing

  try {
    return await prisma.formDefinition.create({
      data: {
        name: tierFormName(tier),
        slug: `situation-room-${tier.toLowerCase()}-registration`,
        accessTier: tier,
        fields: defaultTierFields(tier) as unknown as Prisma.InputJsonValue,
        confirmationType: 'MESSAGE',
        confirmationMessage: TIER_CONFIRMATION_MESSAGE,
        notificationEmails: [ADMIN_NOTIFICATION_EMAIL],
      },
    })
  } catch (error) {
    // Two first requests at once: the other one created it.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return prisma.formDefinition.findUniqueOrThrow({ where: { accessTier: tier } })
    }
    throw error
  }
}

export function ensureTierForms(): Promise<FormDefinition[]> {
  return Promise.all(ACCESS_TIERS.map(getTierForm))
}

/** The fields a tier page can show. Uploads have nowhere to go on these pages. */
export function tierPageFields(form: FormDefinition): FormFieldConfig[] {
  return Array.isArray(form.fields) ? (form.fields as unknown as FormFieldConfig[]).filter((field) => field.type !== 'file') : []
}
