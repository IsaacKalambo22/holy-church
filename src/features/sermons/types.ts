import { z } from 'zod'

export const sermonFilterSchema = z.object({
  search: z.string().optional(),
  series: z.string().optional(),
  preacherId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
})

export type SermonFilter = z.infer<typeof sermonFilterSchema>
