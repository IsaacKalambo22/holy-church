import { z } from 'zod'

// ── Server-only environment variables ────────────────────────────────────────
const serverSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  BUCKET_NAME: z.string().default('holy-church'),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
})

// ── Public environment variables (client + server) ───────────────────────────
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
})

// ── Validate and export ───────────────────────────────────────────────────────
function createEnv() {
  const isServer = typeof window === 'undefined'

  const merged = isServer
    ? serverSchema.merge(clientSchema)
    : clientSchema

  const parsed = merged.safeParse(process.env)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    console.error('❌ Invalid environment variables:')
    Object.entries(errors).forEach(([key, messages]) => {
      console.error(`  ${key}: ${messages?.join(', ')}`)
    })
    throw new Error('Invalid environment configuration. Check the console for details.')
  }

  return parsed.data as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>
}

export const env = createEnv()

export type ServerEnv = z.infer<typeof serverSchema>
export type ClientEnv = z.infer<typeof clientSchema>
export type Env = ServerEnv & ClientEnv
