// Server-side helpers for the auth session cookie.
//
// The JWT is stored in an HttpOnly cookie so it is never readable from
// client-side JavaScript (an XSS bug therefore cannot steal the session).
// Requests to the same-origin `/api/*` routes send this cookie automatically;
// server components read it via next/headers. A Bearer token is still accepted
// as a fallback so server-to-server forwarding keeps working.

export const AUTH_COOKIE = 'auth-token'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

function secureFlag(): string {
  return process.env.NODE_ENV === 'production' ? '; Secure' : ''
}

export function buildAuthCookie(token: string): string {
  return `${AUTH_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secureFlag()}`
}

export function buildClearAuthCookie(): string {
  return `${AUTH_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secureFlag()}`
}

// Extract the JWT from an incoming request: prefer the Authorization header
// (used for server-to-server calls), then fall back to the HttpOnly cookie.
export function getTokenFromHeaders(headers: {
  authorization?: string
  cookie?: string
}): string | null {
  const auth = headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)

  const cookie = headers.cookie
  if (cookie) {
    for (const part of cookie.split(';')) {
      const [key, ...rest] = part.trim().split('=')
      if (key === AUTH_COOKIE) return decodeURIComponent(rest.join('='))
    }
  }
  return null
}
