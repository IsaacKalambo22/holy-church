import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { contentGuard } from '../middleware/rbac'

export const blogRoutes = new Elysia({ prefix: '/blog' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 9
    const skip = (page - 1) * limit
    const publishedOnly = query.published !== 'false'
    const categoryId = query.categoryId as string | undefined
    const search = query.search as string | undefined

    const where: {
      deletedAt: Date | null
      published?: boolean
      categoryId?: string
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; excerpt?: { contains: string; mode: 'insensitive' }; content?: { contains: string; mode: 'insensitive' } }>
    } = { deletedAt: null }
    
    if (publishedOnly) where.published = true
    if (categoryId) where.categoryId = categoryId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: { 
          author: { select: { id: true, name: true, avatar: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.blog.count({ where }),
    ])
    return { success: true, data: posts, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/categories', async () => {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { blogs: { where: { published: true, deletedAt: null } } },
        },
      },
    })
    return { success: true, data: categories }
  })
  .get('/tags', async () => {
    const tags = await prisma.blogTag.findMany({
      orderBy: { name: 'asc' },
    })
    return { success: true, data: tags }
  })
  .get('/slug/:slug', async ({ params, set }) => {
    const post = await prisma.blog.findUnique({
      where: { slug: params.slug, deletedAt: null },
      include: { 
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
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
      include: { 
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    if (!post) {
      set.status = 404
      return { success: false, error: 'Post not found' }
    }
    return { success: true, data: post }
  })
  .use(contentGuard)
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
          slug,
          excerpt: body.excerpt,
          content: body.content,
          status: body.status || 'DRAFT',
          authorId: body.authorId,
          categoryId: body.categoryId,
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
        slug: t.Optional(t.String()),
        excerpt: t.Optional(t.String()),
        content: t.Optional(t.String()),
        status: t.Optional(t.String()),
        authorId: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
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
          slug,
          excerpt: body.excerpt,
          content: body.content,
          status: body.status,
          authorId: body.authorId,
          categoryId: body.categoryId,
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
        slug: t.Optional(t.String()),
        excerpt: t.Optional(t.String()),
        content: t.Optional(t.String()),
        status: t.Optional(t.String()),
        authorId: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
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
