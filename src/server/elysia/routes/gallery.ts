import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { contentGuard } from '../middleware/rbac'

export const galleryRoutes = new Elysia({ prefix: '/gallery' })
  // Legacy Gallery routes (backward compatibility)
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
  .use(contentGuard)
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
  // New Media Album routes
  .get('/albums', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 12
    const skip = (page - 1) * limit

    const [albums, total] = await Promise.all([
      prisma.galleryAlbum.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: { mediaItems: true },
          },
        },
      }),
      prisma.galleryAlbum.count({ where: { deletedAt: null } }),
    ])
    return { success: true, data: albums, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/albums/slug/:slug', async ({ params, set }) => {
    const album = await prisma.galleryAlbum.findUnique({
      where: { slug: params.slug, deletedAt: null },
      include: {
        mediaItems: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    if (!album) {
      set.status = 404
      return { success: false, error: 'Album not found' }
    }
    return { success: true, data: album }
  })
  .get('/albums/:id', async ({ params, set }) => {
    const album = await prisma.galleryAlbum.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        mediaItems: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    if (!album) {
      set.status = 404
      return { success: false, error: 'Album not found' }
    }
    return { success: true, data: album }
  })
  .post(
    '/albums',
    async ({ body }) => {
      const slug = body.slug
        ? body.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : body.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

      const album = await prisma.galleryAlbum.create({
        data: {
          name: body.name,
          slug,
          description: body.description,
          coverImage: body.coverImage,
        },
      })
      return { success: true, data: album }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/albums/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.galleryAlbum.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Album not found' }
      }

      const slug = body.slug
        ? body.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : existing.slug

      const album = await prisma.galleryAlbum.update({
        where: { id: params.id },
        data: {
          name: body.name,
          slug,
          description: body.description,
          coverImage: body.coverImage,
        },
      })
      return { success: true, data: album }
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 3 })),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
      }),
    }
  )
  .delete('/albums/:id', async ({ params, set }) => {
    const existing = await prisma.galleryAlbum.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Album not found' }
    }

    await prisma.galleryAlbum.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Album deleted' }
  })
  // Media Item routes
  .get('/media', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const albumId = query.albumId as string | undefined
    const categoryId = query.categoryId as string | undefined
    const type = query.type as string | undefined

    const where: {
      deletedAt: Date | null
      albumId?: string
      categoryId?: string
      type?: string
    } = { deletedAt: null }
    
    if (albumId) where.albumId = albumId
    if (categoryId) where.categoryId = categoryId
    if (type) where.type = type

    const [items, total] = await Promise.all([
      prisma.mediaItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          album: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.mediaItem.count({ where }),
    ])
    return { success: true, data: items, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/media/:id', async ({ params, set }) => {
    const item = await prisma.mediaItem.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        album: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    if (!item) {
      set.status = 404
      return { success: false, error: 'Media item not found' }
    }
    return { success: true, data: item }
  })
  .post(
    '/media',
    async ({ body }) => {
      const item = await prisma.mediaItem.create({
        data: {
          title: body.title,
          description: body.description,
          type: body.type || 'IMAGE',
          url: body.url,
          thumbnailUrl: body.thumbnailUrl,
          albumId: body.albumId,
          categoryId: body.categoryId,
          uploadedBy: body.uploadedBy,
        },
      })
      return { success: true, data: item }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        type: t.Optional(t.Union([t.Literal('IMAGE'), t.Literal('VIDEO'), t.Literal('AUDIO'), t.Literal('DOCUMENT')])),
        url: t.String(),
        thumbnailUrl: t.Optional(t.String()),
        albumId: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
        uploadedBy: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/media/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.mediaItem.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Media item not found' }
      }

      const item = await prisma.mediaItem.update({
        where: { id: params.id },
        data: {
          title: body.title,
          description: body.description,
          type: body.type,
          url: body.url,
          thumbnailUrl: body.thumbnailUrl,
          albumId: body.albumId,
          categoryId: body.categoryId,
        },
      })
      return { success: true, data: item }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        type: t.Optional(t.Union([t.Literal('IMAGE'), t.Literal('VIDEO'), t.Literal('AUDIO'), t.Literal('DOCUMENT')])),
        url: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        albumId: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
      }),
    }
  )
  .delete('/media/:id', async ({ params, set }) => {
    const existing = await prisma.mediaItem.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Media item not found' }
    }

    await prisma.mediaItem.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Media item deleted' }
  })
  // Media Category routes
  .get('/categories', async () => {
    const categories = await prisma.mediaCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { mediaItems: true },
        },
      },
    })
    return { success: true, data: categories }
  })
  .post(
    '/categories',
    async ({ body }) => {
      const slug = body.slug
        ? body.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : body.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

      const category = await prisma.mediaCategory.create({
        data: {
          name: body.name,
          slug,
        },
      })
      return { success: true, data: category }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        slug: t.Optional(t.String()),
      }),
    }
  )
