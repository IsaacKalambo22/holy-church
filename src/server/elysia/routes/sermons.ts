import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const sermonRoutes = new Elysia({ prefix: '/sermons' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 12
    const skip = (page - 1) * limit
    const publishedOnly = query.published !== 'false'
    const series = query.series as string | undefined

    const where: { deletedAt: Date | null; published?: boolean; series?: string } = { deletedAt: null }
    if (publishedOnly) where.published = true
    if (series) where.series = series

    const [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
        include: { preacher: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.sermon.count({ where }),
    ])
    return { success: true, data: sermons, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/:id', async ({ params, set }) => {
    const sermon = await prisma.sermon.findUnique({
      where: { id: params.id, deletedAt: null },
      include: { preacher: { select: { id: true, name: true, avatar: true } } },
    })
    if (!sermon) {
      set.status = 404
      return { success: false, error: 'Sermon not found' }
    }
    return { success: true, data: sermon }
  })
  .use(authGuard)
  .use(adminGuard)
  .post(
    '/',
    async ({ body }) => {
      const sermon = await prisma.sermon.create({
        data: {
          title: body.title,
          description: body.description,
          videoUrl: body.videoUrl,
          audioUrl: body.audioUrl,
          thumbnailUrl: body.thumbnailUrl,
          series: body.series,
          preacherId: body.preacherId,
          date: body.date ? new Date(body.date) : new Date(),
          published: body.published ?? false,
        },
      })
      return { success: true, data: sermon }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 3 }),
        description: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        audioUrl: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        series: t.Optional(t.String()),
        preacherId: t.Optional(t.String()),
        date: t.Optional(t.String()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.sermon.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Sermon not found' }
      }

      const sermon = await prisma.sermon.update({
        where: { id: params.id },
        data: {
          title: body.title,
          description: body.description,
          videoUrl: body.videoUrl,
          audioUrl: body.audioUrl,
          thumbnailUrl: body.thumbnailUrl,
          series: body.series,
          preacherId: body.preacherId,
          date: body.date ? new Date(body.date) : undefined,
          published: body.published,
        },
      })
      return { success: true, data: sermon }
    },
    {
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3 })),
        description: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        audioUrl: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        series: t.Optional(t.String()),
        preacherId: t.Optional(t.String()),
        date: t.Optional(t.String()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.sermon.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Sermon not found' }
    }

    await prisma.sermon.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Sermon deleted' }
  })
  .post('/:id/views', async ({ params }) => {
    await prisma.sermon.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })
    return { success: true }
  })
