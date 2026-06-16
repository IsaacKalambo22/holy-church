import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'

export const podcastRoutes = new Elysia({ prefix: '/api/podcasts' })
  .get('/', async () => {
    const podcasts = await prisma.podcast.findMany({
      where: { published: true },
      include: { speaker: { select: { id: true, name: true, avatar: true } } },
      orderBy: { publishedAt: 'desc' },
    })
    return { success: true, podcasts }
  })
  .get('/:id', async ({ params }) => {
    const podcast = await prisma.podcast.findUnique({
      where: { id: params.id },
      include: { speaker: { select: { id: true, name: true, avatar: true } } },
    })

    if (!podcast) {
      return { success: false, error: 'Podcast not found' }
    }

    return { success: true, podcast }
  })
  .get('/admin/all', async ({ jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const podcasts = await prisma.podcast.findMany({
      include: { speaker: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, podcasts }
  })
  .post(
    '/',
    async ({ body, jwt, cookie }) => {
      const token = cookie.auth
      if (!token) return { success: false, error: 'Unauthorized' }

      const payload = await jwt.verify(token)
      if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' }
      }

      const { title, description, audioUrl, videoUrl, thumbnailUrl, duration, published } = body

      const podcast = await prisma.podcast.create({
        data: {
          title,
          description,
          audioUrl,
          videoUrl,
          thumbnailUrl,
          duration,
          published,
          speakerId: payload.userId as string,
        },
      })

      return { success: true, podcast }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        audioUrl: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        duration: t.Optional(t.Number()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, jwt, cookie }) => {
      const token = cookie.auth
      if (!token) return { success: false, error: 'Unauthorized' }

      const payload = await jwt.verify(token)
      if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' }
      }

      const podcast = await prisma.podcast.update({
        where: { id: params.id },
        data: body,
      })

      return { success: true, podcast }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        audioUrl: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        duration: t.Optional(t.Number()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete('/:id', async ({ params, jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.podcast.delete({
      where: { id: params.id },
    })

    return { success: true }
  })
