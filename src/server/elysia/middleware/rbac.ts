import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '@/lib/env'

const jwtPlugin = jwt({
  name: 'jwt',
  secret: env.JWT_SECRET,
})

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER'

export const authGuard = new Elysia({ name: 'auth-guard' })
  .use(jwtPlugin)
  .derive(async ({ jwt, headers, set }) => {
    const auth = headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      throw new Error('Unauthorized: No token provided')
    }

    const payload = await jwt.verify(auth.slice(7))
    if (!payload) {
      set.status = 401
      throw new Error('Unauthorized: Invalid token')
    }

    return {
      userId: payload.userId as string,
      role: payload.role as UserRole,
    }
  })

export const adminGuard = new Elysia({ name: 'admin-guard' })
  .use(jwtPlugin)
  .derive(async ({ jwt, headers, set }) => {
    const auth = headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      throw new Error('Unauthorized: No token provided')
    }

    const payload = await jwt.verify(auth.slice(7))
    if (!payload) {
      set.status = 401
      throw new Error('Unauthorized: Invalid token')
    }

    const role = payload.role as UserRole
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      set.status = 403
      throw new Error('Forbidden: Insufficient permissions')
    }

    return {
      userId: payload.userId as string,
      role,
    }
  })

export const superAdminGuard = new Elysia({ name: 'super-admin-guard' })
  .use(jwtPlugin)
  .derive(async ({ jwt, headers, set }) => {
    const auth = headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      throw new Error('Unauthorized: No token provided')
    }

    const payload = await jwt.verify(auth.slice(7))
    if (!payload) {
      set.status = 401
      throw new Error('Unauthorized: Invalid token')
    }

    const role = payload.role as UserRole
    if (role !== 'SUPER_ADMIN') {
      set.status = 403
      throw new Error('Forbidden: Insufficient permissions')
    }

    return {
      userId: payload.userId as string,
      role,
    }
  })
