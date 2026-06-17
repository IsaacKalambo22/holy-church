import { z } from 'zod'

export const donationSchema = z.object({
  amount: z.number().min(100, 'Minimum donation is MWK 100'),
  fund: z.enum([
    'general',
    'missions',
    'building',
    'youth',
    'outreach',
    'children',
  ]).default('general'),
  frequency: z.enum(['one-time', 'monthly', 'weekly']).default('one-time'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().optional(),
})

export type DonationInput = z.infer<typeof donationSchema>

export const FUND_LABELS: Record<DonationInput['fund'], string> = {
  general: 'General Fund',
  missions: 'Missions Fund',
  building: 'Building Fund',
  youth: 'Youth Ministry',
  outreach: 'Community Outreach',
  children: "Children's Ministry",
}
