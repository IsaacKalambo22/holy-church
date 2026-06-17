import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const galleryRoutes = new Elysia({ prefix: '/gallery' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      prisma.gallery.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gallery.count({ where: { deletedAt: null } }),
    ])
    return { success: true, data: items, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/:id', async ({ params, set }) => {
    const item = await prisma.gallery.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!item) {
      set.status = 404
      return { success: false, error: 'Gallery item not found' }
    }
    return { success: true, data: item }
  })
  .use(authGuard)
  .use(adminGuard)
  .post(
    '/',
    async ({ body }) => {
      const item = await prisma.gallery.create({
        data: {
          caption: body.caption,
          imageUrls: body.imageUrls,
        },
      })
      return { success: true, data: item }
    },
    {
      body: t.Object({
        caption: t.String({ minLength: 3 }),
        imageUrls: t.Array(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.gallery.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Gallery item not found' }
      }

      const item = await prisma.gallery.update({
        where: { id: params.id },
        data: {
          caption: body.caption,
          imageUrls: body.imageUrls,
        },
      })
      return { success: true, data: item }
    },
    {
      body: t.Object({
        caption: t.Optional(t.String({ minLength: 3 })),
        imageUrls: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.gallery.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Gallery item not found' }
    }

    await prisma.gallery.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Gallery item deleted' }
  })
