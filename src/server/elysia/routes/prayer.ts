import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const prayerRoutes = new Elysia({ prefix: '/prayer' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const status = query.status as string | undefined
    const publicOnly = query.public !== 'false'

    const where: { deletedAt: Date | null; isAnonymous?: boolean; status?: string } = { deletedAt: null }
    if (publicOnly) where.isAnonymous = false
    if (status) where.status = status

    const [requests, total] = await Promise.all([
      prisma.prayerRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.prayerRequest.count({ where }),
    ])
    return { success: true, data: requests, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/:id', async ({ params, set }) => {
    const request = await prisma.prayerRequest.findUnique({
      where: { id: params.id, deletedAt: null },
      include: { user: { select: { id: true, name: true } } },
    })
    if (!request) {
      set.status = 404
      return { success: false, error: 'Prayer request not found' }
    }
    return { success: true, data: request }
  })
  .post(
    '/',
    async ({ body }) => {
      const request = await prisma.prayerRequest.create({
        data: {
          request: body.request,
          isAnonymous: body.isAnonymous ?? false,
          userId: body.userId,
          status: 'PENDING',
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
  .use(authGuard)
  .use(adminGuard)
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.prayerRequest.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Prayer request not found' }
      }

      const request = await prisma.prayerRequest.update({
        where: { id: params.id },
        data: {
          request: body.request,
          isAnonymous: body.isAnonymous,
          status: body.status,
        },
      })
      return { success: true, data: request }
    },
    {
      body: t.Object({
        request: t.Optional(t.String({ minLength: 10 })),
        isAnonymous: t.Optional(t.Boolean()),
        status: t.Optional(t.Union([t.Literal('PENDING'), t.Literal('PRAYED'), t.Literal('ARCHIVED')])),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.prayerRequest.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Prayer request not found' }
    }

    await prisma.prayerRequest.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Prayer request deleted' }
  })
