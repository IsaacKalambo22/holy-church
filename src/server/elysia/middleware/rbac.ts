import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '@/lib/env'
import { getTokenFromHeaders } from '@/lib/auth-cookie'
import { ADMIN_ROLES, CONTENT_ROLES, FINANCE_ROLES, type UserRole } from '@/lib/roles'

const jwtPlugin = jwt({
  name: 'jwt',
  secret: env.JWT_SECRET,
})

export type { UserRole }

function getPayload(
  headers: { authorization?: string; cookie?: string },
  verify: (t: string) => Promise<unknown>
) {
  const token = getTokenFromHeaders(headers)
  if (!token) return Promise.resolve(null)
  return verify(token).then((p) => p || null)
}

// Builds a scoped guard. `allowedRoles === null` means "any authenticated user".
//
// NOTE: the check uses `onBeforeHandle` with `{ as: 'scoped' }` so the hook
// propagates to the routes of the parent instance that `.use()`s this guard.
// A plugin's lifecycle hooks are encapsulated by default, so a plain `.derive`
// would never run for the consumer's routes, silently leaving them open.
function roleGuard(name: string, allowedRoles: UserRole[] | null) {
  return new Elysia({ name })
    .use(jwtPlugin)
    .onBeforeHandle({ as: 'scoped' }, async ({ jwt, headers, set }) => {
      const payload = (await getPayload(headers, jwt.verify)) as { role?: UserRole } | null
      if (!payload) {
        set.status = 401
        return { success: false, error: 'Unauthorized' }
      }
      if (allowedRoles && (!payload.role || !allowedRoles.includes(payload.role))) {
        set.status = 403
        return { success: false, error: 'Forbidden: Insufficient permissions' }
      }
    })
}

// Any authenticated user (used for a member's own resources).
export const authGuard = roleGuard('auth-guard', null)

// Full management: SUPER_ADMIN, ADMIN, PASTOR.
export const adminGuard = roleGuard('admin-guard', ADMIN_ROLES)

// Content management: admins + CONTENT_MANAGER / MINISTRY_LEADER.
export const contentGuard = roleGuard('content-guard', CONTENT_ROLES)

// Finance/donation management: admins + FINANCE_MANAGER.
export const financeGuard = roleGuard('finance-guard', FINANCE_ROLES)

// Highest privilege only.
export const superAdminGuard = roleGuard('super-admin-guard', ['SUPER_ADMIN'])
