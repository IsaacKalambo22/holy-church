import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const eventRoutes = new Elysia({ prefix: '/events' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit
    const upcomingOnly = query.upcoming !== 'false'
    const category = query.category as string | undefined

    const where: { deletedAt: Date | null; date?: { gte: Date }; category?: string } = { deletedAt: null }
    if (upcomingOnly) where.date = { gte: new Date() }
    if (category) where.category = category

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])
    return { success: true, data: events, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/:id', async ({ params, set }) => {
    const event = await prisma.event.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!event) {
      set.status = 404
      return { success: false, error: 'Event not found' }
    }
    return { success: true, data: event }
  })
  .use(authGuard)
  .use(adminGuard)
  .post(
    '/',
    async ({ body }) => {
      const event = await prisma.event.create({
        data: {
          title: body.title,
          description: body.description,
          date: new Date(body.date),
          endDate: body.endDate ? new Date(body.endDate) : null,
          location: body.location,
          imageUrl: body.imageUrl,
          category: body.category,
        },
      })
      return { success: true, data: event }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 3 }),
        description: t.Optional(t.String()),
        date: t.String(),
        endDate: t.Optional(t.String()),
        location: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        category: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.event.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Event not found' }
      }

      const event = await prisma.event.update({
        where: { id: params.id },
        data: {
          title: body.title,
          description: body.description,
          date: body.date ? new Date(body.date) : undefined,
          endDate: body.endDate ? new Date(body.endDate) : undefined,
          location: body.location,
          imageUrl: body.imageUrl,
          category: body.category,
        },
      })
      return { success: true, data: event }
    },
    {
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3 })),
        description: t.Optional(t.String()),
        date: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
        location: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        category: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.event.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Event not found' }
    }

    await prisma.event.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Event deleted' }
  })
