import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '@/lib/env'

const jwtPlugin = jwt({
  name: 'jwt',
  secret: env.JWT_SECRET,
})

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER'

// NOTE: The auth checks below use `onBeforeHandle` with `{ as: 'scoped' }` so
// that the hook propagates to the routes of the parent instance that `.use()`s
// this guard. A plugin's lifecycle hooks are encapsulated by default, so a
// plain `.derive(...)` here would NOT run for the consumer's routes, silently
// leaving every "protected" endpoint open. Scoped hooks apply to routes
// registered *after* the `.use(guard)` call in the consumer, which is exactly
// where the protected routes live.

function getPayload(auth: string | undefined, verify: (t: string) => Promise<unknown>) {
  if (!auth?.startsWith('Bearer ')) return Promise.resolve(null)
  return verify(auth.slice(7)).then((p) => p || null)
}

export const authGuard = new Elysia({ name: 'auth-guard' })
  .use(jwtPlugin)
  .onBeforeHandle({ as: 'scoped' }, async ({ jwt, headers, set }) => {
    const payload = await getPayload(headers.authorization, jwt.verify)
    if (!payload) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }
  })

export const adminGuard = new Elysia({ name: 'admin-guard' })
  .use(jwtPlugin)
  .onBeforeHandle({ as: 'scoped' }, async ({ jwt, headers, set }) => {
    const payload = (await getPayload(headers.authorization, jwt.verify)) as {
      role?: UserRole
    } | null
    if (!payload) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
      set.status = 403
      return { success: false, error: 'Forbidden: Insufficient permissions' }
    }
  })

export const superAdminGuard = new Elysia({ name: 'super-admin-guard' })
  .use(jwtPlugin)
  .onBeforeHandle({ as: 'scoped' }, async ({ jwt, headers, set }) => {
    const payload = (await getPayload(headers.authorization, jwt.verify)) as {
      role?: UserRole
    } | null
    if (!payload) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }
    if (payload.role !== 'SUPER_ADMIN') {
      set.status = 403
      return { success: false, error: 'Forbidden: Insufficient permissions' }
    }
  })
