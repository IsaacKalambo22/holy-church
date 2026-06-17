import { z } from 'zod'

export const prayerRequestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional().or(z.literal('')),
  request: z.string().min(10, 'Please describe your request in at least 10 characters'),
  isAnonymous: z.boolean().default(false),
  shareWithCongregation: z.boolean().default(false),
})

export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>
