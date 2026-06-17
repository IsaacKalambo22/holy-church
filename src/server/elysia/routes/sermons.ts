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
    const speaker = query.speaker as string | undefined
    const year = query.year as string | undefined
    const search = query.search as string | undefined
    const sort = (query.sort as string) || 'newest'

    const where: {
      deletedAt: Date | null
      published?: boolean
      series?: string
      preacher?: { name: { contains: string; mode: 'insensitive' } }
      date?: { gte: Date; lte: Date }
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' }; series?: { contains: string; mode: 'insensitive' } }>
    } = { deletedAt: null }
    
    if (publishedOnly) where.published = true
    if (series) where.series = series
    if (speaker) where.preacher = { name: { contains: speaker, mode: 'insensitive' } }
    if (year) {
      const startDate = new Date(`${year}-01-01`)
      const endDate = new Date(`${year}-12-31`)
      where.date = { gte: startDate, lte: endDate }
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { series: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: { date?: 'desc' | 'asc'; views?: 'desc' } = {}
    if (sort === 'oldest') orderBy.date = 'asc'
    else if (sort === 'views') orderBy.views = 'desc'
    else orderBy.date = 'desc'

    const [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { preacher: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.sermon.count({ where }),
    ])
    return { success: true, data: sermons, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/slug/:slug', async ({ params, set }) => {
    const sermon = await prisma.sermon.findUnique({
      where: { slug: params.slug, deletedAt: null },
      include: { preacher: { select: { id: true, name: true, avatar: true } } },
    })
    if (!sermon) {
      set.status = 404
      return { success: false, error: 'Sermon not found' }
    }
    return { success: true, data: sermon }
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
          slug: body.slug,
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
        slug: t.String({ minLength: 3 }),
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
          slug: body.slug,
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
        slug: t.Optional(t.String({ minLength: 3 })),
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
