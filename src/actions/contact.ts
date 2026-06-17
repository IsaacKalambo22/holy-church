'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export type ActionResult<T = null> =
  | { success: true; data: T; message: string }
  | { success: false; error: string }

export async function submitContactMessage(
  formData: ContactFormData
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  await prisma.contactMessage.create({ data: parsed.data })
  return { success: true, data: null, message: 'Message sent successfully!' }
}
