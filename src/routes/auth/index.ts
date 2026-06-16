import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'
import { hashPassword, verifyPassword } from '../../lib/auth'
import { sendEmail } from '../../lib/email'

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post(
    '/register',
    async ({ body }) => {
      const { email, password, name, phoneNumber } = body

      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return { success: false, error: 'Email already exists' }
      }

      const hashedPassword = await hashPassword(password!)
      const verificationToken = Math.random().toString(36).substring(7)
      const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phoneNumber,
          verificationToken,
          verificationTokenExpiresAt,
        },
      })

      // Send verification email
      await sendEmail({
        to: email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${process.env.APP_URL}/verify/${verificationToken}">here</a> to verify your email</p>`,
      })

      return { success: true, user: { id: user.id, email: user.email, name: user.name } }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        name: t.String(),
        phoneNumber: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/login',
    async ({ body, jwt, cookie }) => {
      const { email, password } = body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.password) {
        return { success: false, error: 'Invalid credentials' }
      }

      const isValid = await verifyPassword(password, user.password)

      if (!isValid) {
        return { success: false, error: 'Invalid credentials' }
      }

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      cookie.auth.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      })

      return {
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post('/logout', async ({ cookie }) => {
    cookie.auth.remove()
    return { success: true }
  })
  .post(
    '/forgot-password',
    async ({ body }) => {
      const { email } = body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      const resetToken = Math.random().toString(36).substring(7)
      const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000)

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpiresAt: resetTokenExpiresAt,
        },
      })

      await sendEmail({
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${process.env.APP_URL}/reset-password/${resetToken}">here</a> to reset your password</p>`,
      })

      return { success: true }
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    }
  )
  .post(
    '/reset-password',
    async ({ body }) => {
      const { token, password } = body

      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpiresAt: { gte: new Date() },
        },
      })

      if (!user) {
        return { success: false, error: 'Invalid or expired token' }
      }

      const hashedPassword = await hashPassword(password)

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpiresAt: null,
        },
      })

      return { success: true }
    },
    {
      body: t.Object({
        token: t.String(),
        password: t.String(),
      }),
    }
  )
  .get('/me', async ({ jwt, cookie }) => {
    const token = cookie.auth

    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const payload = await jwt.verify(token)

    if (!payload) {
      return { success: false, error: 'Invalid token' }
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        isVerified: true,
      },
    })

    return { success: true, user }
  })
