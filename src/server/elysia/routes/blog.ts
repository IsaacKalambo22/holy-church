import { Elysia } from 'elysia'
import { prisma } from '@/lib/prisma'

export const blogRoutes = new Elysia({ prefix: '/blog' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 9
    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
      prisma.blog.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { author: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.blog.count({ where: { published: true } }),
    ])
    return { success: true, data: posts, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/:id', async ({ params, set }) => {
    const post = await prisma.blog.findUnique({
      where: { id: params.id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    })
    if (!post) { set.status = 404; return { success: false, error: 'Post not found' } }
    return { success: true, data: post }
  })
