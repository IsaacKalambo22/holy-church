import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const blogRoutes = new Elysia({ prefix: '/blog' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 9
    const skip = (page - 1) * limit
    const publishedOnly = query.published !== 'false'

    const where: { deletedAt: Date | null; published?: boolean } = { deletedAt: null }
    if (publishedOnly) where.published = true

    const [posts, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: { author: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.blog.count({ where }),
    ])
    return { success: true, data: posts, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/slug/:slug', async ({ params, set }) => {
    const post = await prisma.blog.findUnique({
      where: { slug: params.slug, deletedAt: null },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    })
    if (!post) {
      set.status = 404
      return { success: false, error: 'Post not found' }
    }
    return { success: true, data: post }
  })
  .get('/:id', async ({ params, set }) => {
    const post = await prisma.blog.findUnique({
      where: { id: params.id, deletedAt: null },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    })
    if (!post) {
      set.status = 404
      return { success: false, error: 'Post not found' }
    }
    return { success: true, data: post }
  })
  .use(authGuard)
  .use(adminGuard)
  .post(
    '/',
    async ({ body }) => {
      const slug = body.slug
        ? body.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

      const post = await prisma.blog.create({
        data: {
          title: body.title,
          content: body.content,
          slug,
          authorId: body.authorId,
          thumbnailUrl: body.thumbnailUrl,
          published: body.published ?? false,
          publishedAt: body.published ? new Date() : null,
        },
      })
      return { success: true, data: post }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 3 }),
        content: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        authorId: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.blog.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Post not found' }
      }

      const slug = body.slug
        ? body.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : existing.slug

      const post = await prisma.blog.update({
        where: { id: params.id },
        data: {
          title: body.title,
          content: body.content,
          slug,
          authorId: body.authorId,
          thumbnailUrl: body.thumbnailUrl,
          published: body.published,
          publishedAt: body.published && !existing.published ? new Date() : existing.publishedAt,
        },
      })
      return { success: true, data: post }
    },
    {
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3 })),
        content: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        authorId: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.blog.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Post not found' }
    }

    await prisma.blog.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Post deleted' }
  })
