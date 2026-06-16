import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'
import { uploadToS3, deleteFromS3 } from '../../lib/s3'

export const sermonRoutes = new Elysia({ prefix: '/api/sermons' })
  .get('/', async () => {
    const sermons = await prisma.sermon.findMany({
      include: { preacher: { select: { id: true, name: true, avatar: true } } },
      orderBy: { date: 'desc' },
    })
    return { success: true, sermons }
  })
  .get('/:id', async ({ params }) => {
    const sermon = await prisma.sermon.findUnique({
      where: { id: params.id },
      include: { preacher: { select: { id: true, name: true, avatar: true } } },
    })

    if (!sermon) {
      return { success: false, error: 'Sermon not found' }
    }

    return { success: true, sermon }
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

      const { title, description, videoUrl, audioUrl, thumbnailUrl, preacherId } = body

      const sermon = await prisma.sermon.create({
        data: {
          title,
          description,
          videoUrl,
          audioUrl,
          thumbnailUrl,
          preacherId,
        },
      })

      return { success: true, sermon }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        audioUrl: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        preacherId: t.Optional(t.String()),
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

      const sermon = await prisma.sermon.update({
        where: { id: params.id },
        data: body,
      })

      return { success: true, sermon }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        audioUrl: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        preacherId: t.Optional(t.String()),
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

    await prisma.sermon.delete({
      where: { id: params.id },
    })

    return { success: true }
  })
