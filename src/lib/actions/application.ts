'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { readResponses, contactDetails, findOrCreatePerson } from '@/lib/form-submission'
import type { FormFieldConfig } from '@/lib/forms'

export type ApplicationActionState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

export async function submitApplication(
  _prevState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  // programSlug travels as a hidden field rather than a `.bind()`-ed argument
  // for the same reason as eventSlug in submitRegistration: `.bind()` plus
  // useActionState hangs the response in this Next 16 + Turbopack setup.
  const programSlug = (formData.get('programSlug') as string | null) ?? ''

  const program = await prisma.program.findUnique({
    where: { slug: programSlug },
    include: { applicationForm: true },
  })

  if (!program) return { status: 'error', message: 'This program could not be found.' }
  if (program.status !== 'OPEN_FOR_APPLICATIONS') {
    return { status: 'error', message: 'Applications for this program are closed.' }
  }
  if (!program.applicationForm) {
    return { status: 'error', message: 'Applications are not yet configured for this program.' }
  }

  const fields = program.applicationForm.fields as unknown as FormFieldConfig[]
  const parsed = readResponses(fields, formData)
  if (!parsed.ok) return { status: 'error', message: parsed.message }
  const { responses } = parsed

  const contact = contactDetails(fields, responses)
  if (!contact.email) {
    return { status: 'error', message: 'An email address is required to apply.' }
  }

  const person = await findOrCreatePerson(contact)

  await prisma.application.create({
    data: {
      programId: program.id,
      formId: program.applicationForm.id,
      personId: person.id,
      responses,
      status: 'SUBMITTED',
    },
  })

  if (program.applicationForm.confirmationType === 'REDIRECT' && program.applicationForm.redirectUrl) {
    revalidatePath(`/programs/${programSlug}`)
    redirect(program.applicationForm.redirectUrl)
  }

  // No revalidatePath on the same-page path — see the note in submitRegistration.
  return {
    status: 'success',
    message: program.applicationForm.confirmationMessage ?? 'Your application has been received.',
  }
}
