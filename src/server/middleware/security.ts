import type { Context } from 'elysia'

export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' https:; frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com; object-src 'none'; frame-ancestors 'none';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

export function addSecurityHeaders(context: Context) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    context.set.headers[key] = value
  })
  return context
}

// Simple in-memory rate limiter
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(options: {
  windowMs: number
  maxRequests: number
  keyGenerator: (context: Context) => string
}) {
  return (context: Context) => {
    const key = options.keyGenerator(context)
    const now = Date.now()
    const record = rateLimitStore.get(key)

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + options.windowMs,
      })
      return context
    }

    if (record.count >= options.maxRequests) {
      context.set.status = 429
      context.set.headers['Retry-After'] = Math.ceil((record.resetTime - now) / 1000).toString()
      context.set.headers['X-RateLimit-Limit'] = options.maxRequests.toString()
      context.set.headers['X-RateLimit-Remaining'] = '0'
      context.set.headers['X-RateLimit-Reset'] = record.resetTime.toString()
      throw new Error('Too many requests')
    }

    record.count++
    context.set.headers['X-RateLimit-Limit'] = options.maxRequests.toString()
    context.set.headers['X-RateLimit-Remaining'] = (options.maxRequests - record.count).toString()
    context.set.headers['X-RateLimit-Reset'] = record.resetTime.toString()

    return context
  }
}

export function getClientIP(context: Context): string {
  return (
    (context.request.headers.get('x-forwarded-for') as string)?.split(',')[0].trim() ||
    (context.request.headers.get('x-real-ip') as string) ||
    'unknown'
  )
}
