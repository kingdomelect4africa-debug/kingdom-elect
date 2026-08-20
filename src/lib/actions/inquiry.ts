'use server'

import { prisma } from '@/lib/db'
import type { InquiryType } from '@prisma/client'

export type InquiryActionState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

export async function submitInquiry(
  _prevState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  const type = formData.get('type') as InquiryType | null
  const name = (formData.get('name') as string | null)?.trim()
  const email = (formData.get('email') as string | null)?.trim()
  const phone = (formData.get('phone') as string | null)?.trim() || undefined
  const organization = (formData.get('organization') as string | null)?.trim() || undefined
  const message = (formData.get('message') as string | null)?.trim()

  if (!type || !name || !email || !message) {
    return { status: 'error', message: 'Please complete all required fields.' }
  }

  await prisma.inquiry.create({
    data: { type, name, email, phone, organization, message },
  })

  return { status: 'success', message: "Thank you — your message has been received. Our team will follow up shortly." }
}
