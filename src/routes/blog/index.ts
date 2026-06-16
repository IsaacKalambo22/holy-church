import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'

export const blogRoutes = new Elysia({ prefix: '/api/blog' })
  .get('/', async () => {
    const blogPosts = await prisma.blog.findMany({
      where: { published: true },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, blogPosts }
  })
  .get('/:id', async ({ params }) => {
    const blogPost = await prisma.blog.findUnique({
      where: { id: params.id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    })

    if (!blogPost) {
      return { success: false, error: 'Blog post not found' }
    }

    return { success: true, blogPost }
  })
  .get('/admin/all', async ({ jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const blogPosts = await prisma.blog.findMany({
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, blogPosts }
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

      const { title, content, thumbnailUrl, published } = body

      const blogPost = await prisma.blog.create({
        data: {
          title,
          content,
          thumbnailUrl,
          published,
          authorId: payload.userId as string,
        },
      })

      return { success: true, blogPost }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
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

      const blogPost = await prisma.blog.update({
        where: { id: params.id },
        data: body,
      })

      return { success: true, blogPost }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        content: t.Optional(t.String()),
        thumbnailUrl: t.Optional(t.String()),
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

    await prisma.blog.delete({
      where: { id: params.id },
    })

    return { success: true }
  })
