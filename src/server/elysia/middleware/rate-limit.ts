import { Elysia } from 'elysia'

// Simple in-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export const rateLimit = (options: { maxRequests: number; windowMs: number }) => {
  return new Elysia({ name: 'rate-limit' })
    .onBeforeHandle(({ request, set }) => {
      const ip = request.headers.get('x-forwarded-for') || 'unknown'
      const now = Date.now()

      const record = rateLimitStore.get(ip)

      if (!record || record.resetTime < now) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + options.windowMs })
        return
      }

      if (record.count >= options.maxRequests) {
        set.status = 429
        set.headers['Retry-After'] = Math.ceil((record.resetTime - now) / 1000).toString()
        return {
          success: false,
          error: 'Too many requests',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        }
      }

      record.count++
    })
}

// Pre-configured rate limiters
export const apiRateLimit = rateLimit({ maxRequests: 100, windowMs: 60000 }) // 100 req/min
export const authRateLimit = rateLimit({ maxRequests: 5, windowMs: 60000 }) // 5 req/min
export const strictRateLimit = rateLimit({ maxRequests: 10, windowMs: 60000 }) // 10 req/min
