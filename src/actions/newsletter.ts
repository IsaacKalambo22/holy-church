'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import type { ActionResult } from './contact'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

export async function subscribeToNewsletter(
  formData: z.infer<typeof newsletterSchema>
): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: parsed.data.email },
  })

  if (existing) {
    if (existing.active) return { success: false, error: 'You are already subscribed.' }
    await prisma.newsletterSubscriber.update({
      where: { email: parsed.data.email },
      data: { active: true },
    })
    return { success: true, data: null, message: 'Welcome back! You have been resubscribed.' }
  }

  await prisma.newsletterSubscriber.create({ data: parsed.data })
  return { success: true, data: null, message: 'You have been subscribed successfully!' }
}
