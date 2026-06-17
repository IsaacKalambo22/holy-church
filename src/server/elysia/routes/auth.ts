import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

const jwtPlugin = jwt({
  name: 'jwt',
  secret: process.env.JWT_SECRET || 'holy-church-dev-secret',
})

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwtPlugin)
  .post(
    '/register',
    async ({ body, set }) => {
      const { email, password, name } = body
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        set.status = 409
        return { success: false, error: 'Email already registered' }
      }
      const hashed = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: { email, password: hashed, name },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      })
      return { success: true, data: user }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
        name: t.String({ minLength: 2 }),
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
      const token = await jwt.sign({ userId: user.id, role: user.role })
      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
      return {
        success: true,
        data: {
          token,
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
  .get('/me', async ({ headers, jwt, set }) => {
    const auth = headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }
    const payload = await jwt.verify(auth.slice(7))
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
