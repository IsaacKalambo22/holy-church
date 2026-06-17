import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'

export const prayerRoutes = new Elysia({ prefix: '/prayer' })
  .post(
    '/',
    async ({ body }) => {
      const request = await prisma.prayerRequest.create({
        data: {
          request: body.request,
          isAnonymous: body.isAnonymous ?? false,
          userId: body.userId,
        },
      })
      return { success: true, data: request }
    },
    {
      body: t.Object({
        request: t.String({ minLength: 10 }),
        isAnonymous: t.Optional(t.Boolean()),
        userId: t.Optional(t.String()),
      }),
    }
  )
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const [requests, total] = await Promise.all([
      prisma.prayerRequest.findMany({
        where: { isAnonymous: false },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.prayerRequest.count({ where: { isAnonymous: false } }),
    ])
    return { success: true, data: requests, total, page, limit }
  })
