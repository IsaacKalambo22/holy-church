import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'
import { sendEmail } from '@/lib/email'
import { buildAuthCookie, buildClearAuthCookie, getTokenFromHeaders } from '@/lib/auth-cookie'

const jwtPlugin = jwt({
  name: 'jwt',
  secret: env.JWT_SECRET,
})

// Cryptographically-secure, unguessable password-reset token.
function generateResetToken(): string {
  return randomBytes(32).toString('hex')
}

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwtPlugin)
  .post(
    '/register',
    async ({ body, set }) => {
      const { email, password, name, learningTrack } = body
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        set.status = 409
        return { success: false, error: 'Email already registered' }
      }
      const hashed = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: { email, password: hashed, name, role: 'MEMBER', learningTrack: learningTrack || null },
        select: { id: true, email: true, name: true, role: true, learningTrack: true, createdAt: true },
      })
      return { success: true, data: user }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
        name: t.String({ minLength: 2 }),
        learningTrack: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/login',
    async ({ body, jwt, set }) => {
      const { email, password } = body
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || !user.password) {
        set.status = 401
        return { success: false, error: 'Invalid credentials' }
      }
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        set.status = 401
        return { success: false, error: 'Invalid credentials' }
      }
      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      })
      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
      // Store the JWT in an HttpOnly cookie instead of returning it to JS.
      set.headers['Set-Cookie'] = buildAuthCookie(token)
      return {
        success: true,
        data: {
          user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
        },
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    }
  )
  .post(
    '/forgot-password',
    async ({ body }) => {
      const { email } = body
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        // Return success even if user not found to prevent email enumeration
        return { success: true, message: 'If an account exists, a reset link has been sent.' }
      }
      const resetToken = generateResetToken()
      const resetExpires = new Date(Date.now() + 3600000) // 1 hour
      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: resetToken, resetPasswordExpiresAt: resetExpires },
      })

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`
      await sendEmail({
        to: user.email,
        subject: 'Reset your Holy Church Assembly password',
        html: `
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password. Click the link below to choose a new one. This link expires in 1 hour.</p>
          <p><a href="${resetUrl}">Reset your password</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      })

      return { success: true, message: 'If an account exists, a reset link has been sent.' }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
    }
  )
  .post(
    '/reset-password',
    async ({ body, set }) => {
      const { token, password } = body
      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpiresAt: { gt: new Date() },
        },
      })
      if (!user) {
        set.status = 400
        return { success: false, error: 'Invalid or expired reset token' }
      }
      const hashed = await bcrypt.hash(password, 12)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed, resetPasswordToken: null, resetPasswordExpiresAt: null },
      })
      return { success: true, message: 'Password reset successfully.' }
    },
    {
      body: t.Object({
        token: t.String(),
        password: t.String({ minLength: 8 }),
      }),
    }
  )
  .post('/logout', ({ set }) => {
    set.headers['Set-Cookie'] = buildClearAuthCookie()
    return { success: true, message: 'Logged out' }
  })
  .get('/me', async ({ headers, jwt, set }) => {
    const token = getTokenFromHeaders(headers)
    if (!token) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }
    const payload = await jwt.verify(token)
    if (!payload) {
      set.status = 401
      return { success: false, error: 'Invalid token' }
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { id: true, email: true, name: true, role: true, avatar: true, isVerified: true },
    })
    if (!user) {
      set.status = 404
      return { success: false, error: 'User not found' }
    }
    return { success: true, data: user }
  })
