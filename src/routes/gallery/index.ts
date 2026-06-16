import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'

export const galleryRoutes = new Elysia({ prefix: '/api/gallery' })
  .get('/', async () => {
    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, galleries }
  })
  .get('/:id', async ({ params }) => {
    const gallery = await prisma.gallery.findUnique({
      where: { id: params.id },
    })

    if (!gallery) {
      return { success: false, error: 'Gallery not found' }
    }

    return { success: true, gallery }
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

      const { caption, imageUrls } = body

      const gallery = await prisma.gallery.create({
        data: {
          caption,
          imageUrls,
        },
      })

      return { success: true, gallery }
    },
    {
      body: t.Object({
        caption: t.String(),
        imageUrls: t.Array(t.String()),
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

      const gallery = await prisma.gallery.update({
        where: { id: params.id },
        data: body,
      })

      return { success: true, gallery }
    },
    {
      body: t.Object({
        caption: t.Optional(t.String()),
        imageUrls: t.Optional(t.Array(t.String())),
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

    await prisma.gallery.delete({
      where: { id: params.id },
    })

    return { success: true }
  })
