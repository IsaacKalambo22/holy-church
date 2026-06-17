'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import type { ActionResult } from './contact'

const prayerSchema = z.object({
  request: z.string().min(10, 'Please describe your prayer request'),
  isAnonymous: z.boolean().default(false),
  userId: z.string().optional(),
})

export type PrayerFormData = z.infer<typeof prayerSchema>

export async function submitPrayerRequest(
  formData: PrayerFormData
): Promise<ActionResult> {
  const parsed = prayerSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  await prisma.prayerRequest.create({ data: parsed.data })
  return {
    success: true,
    data: null,
    message: 'Your prayer request has been submitted. Our team is praying for you.',
  }
}
