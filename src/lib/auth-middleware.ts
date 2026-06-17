import { cookies } from 'next/headers'
import { env } from './env'
import { jwtVerify } from 'jose'

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar: string | null
  isVerified: boolean
}

export interface AuthSession {
  user: AuthUser
  token: string
}

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET)

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return {
      user: {
        id: payload.userId as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as UserRole,
        avatar: payload.avatar as string | null,
        isVerified: payload.isVerified as boolean,
      },
      token,
    }
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession()
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  return session
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthSession> {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('FORBIDDEN')
  }
  return session
}

export function hasRole(user: AuthUser, role: UserRole): boolean {
  if (user.role === 'SUPER_ADMIN') return true
  if (role === 'ADMIN' && user.role === 'ADMIN') return true
  if (role === 'MEMBER') return true
  return false
}
