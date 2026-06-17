import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const prayerRoutes = new Elysia({ prefix: '/prayer' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const status = query.status as string | undefined
    const category = query.category as string | undefined
    const publicOnly = query.public !== 'false'
    const userId = query.userId as string | undefined

    const where: {
      deletedAt: Date | null
      isAnonymous?: boolean
      isPublic?: boolean
      status?: string
      category?: string
      userId?: string
    } = { deletedAt: null }
    
    if (publicOnly) where.isPublic = true
    if (status) where.status = status
    if (category) where.category = category
    if (userId) where.userId = userId

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
          title: body.title,
          request: body.request,
          category: body.category,
          isAnonymous: body.isAnonymous ?? false,
          isPublic: body.isPublic ?? false,
          userId: body.userId,
          status: 'PENDING',
        },
      })
      return { success: true, data: request }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        request: t.String({ minLength: 10 }),
        category: t.Optional(t.String()),
        isAnonymous: t.Optional(t.Boolean()),
        isPublic: t.Optional(t.Boolean()),
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
          title: body.title,
          request: body.request,
          category: body.category,
          isAnonymous: body.isAnonymous,
          isPublic: body.isPublic,
          status: body.status,
        },
      })
      return { success: true, data: request }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        request: t.Optional(t.String({ minLength: 10 })),
        category: t.Optional(t.String()),
        isAnonymous: t.Optional(t.Boolean()),
        isPublic: t.Optional(t.Boolean()),
        status: t.Optional(t.Union([t.Literal('PENDING'), t.Literal('PRAYED'), t.Literal('ANSWERED'), t.Literal('ARCHIVED')])),
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
