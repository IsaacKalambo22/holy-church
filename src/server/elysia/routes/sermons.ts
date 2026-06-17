import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'

export const sermonRoutes = new Elysia({ prefix: '/sermons' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 12
    const skip = (page - 1) * limit
    const [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where: { published: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
        include: { preacher: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.sermon.count({ where: { published: true } }),
    ])
    return { success: true, data: sermons, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/:id', async ({ params, set }) => {
    const sermon = await prisma.sermon.findUnique({
      where: { id: params.id },
      include: { preacher: { select: { id: true, name: true, avatar: true } } },
    })
    if (!sermon) { set.status = 404; return { success: false, error: 'Sermon not found' } }
    return { success: true, data: sermon }
  })
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
        },
      })
      return { success: true, data: sermon }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        audioUrl: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        series: t.Optional(t.String()),
        preacherId: t.Optional(t.String()),
        date: t.Optional(t.String()),
      }),
    }
  )
