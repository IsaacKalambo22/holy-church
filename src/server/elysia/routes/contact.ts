import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'

export const contactRoutes = new Elysia({ prefix: '/contact' })
  .post(
    '/',
    async ({ body }) => {
      const message = await prisma.contactMessage.create({ data: body })
      return { success: true, data: message }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2 }),
        email: t.String({ format: 'email' }),
        subject: t.Optional(t.String()),
        message: t.String({ minLength: 10 }),
      }),
    }
  )
