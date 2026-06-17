import { Elysia } from 'elysia'
import { prisma } from '@/lib/prisma'

export const searchRoutes = new Elysia({ prefix: '/search' })
  .get('/', async ({ query }) => {
    const q = query.q as string | undefined
    const type = query.type as string | undefined
    const limit = Number(query.limit) || 10

    if (!q || q.length < 2) {
      return { success: true, data: { results: [], total: 0 } }
    }

    const results: Array<{
      id: string
      type: string
      title: string
      description?: string
      url: string
      metadata?: Record<string, unknown>
    }> = []

    const searchTypes = type ? [type] : ['sermons', 'events', 'ministries', 'blog', 'gallery']

    if (searchTypes.includes('sermons')) {
      const sermons = await prisma.sermon.findMany({
        where: {
          deletedAt: null,
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { series: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          preacher: { select: { name: true } },
        },
      })

      sermons.forEach((sermon) => {
        results.push({
          id: sermon.id,
          type: 'sermon',
          title: sermon.title,
          description: sermon.description || '',
          url: `/sermons/${sermon.id}`,
          metadata: {
            date: sermon.date,
            preacher: sermon.preacher?.name,
          },
        })
      })
    }

    if (searchTypes.includes('events')) {
      const events = await prisma.event.findMany({
        where: {
          deletedAt: null,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          location: true,
        },
      })

      events.forEach((event) => {
        results.push({
          id: event.id,
          type: 'event',
          title: event.title,
          description: event.description || '',
          url: `/events/${event.id}`,
          metadata: {
            date: event.date,
            location: event.location,
          },
        })
      })
    }

    if (searchTypes.includes('ministries')) {
      const ministries = await prisma.ministry.findMany({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
        },
      })

      ministries.forEach((ministry) => {
        results.push({
          id: ministry.id,
          type: 'ministry',
          title: ministry.name,
          description: ministry.description || '',
          url: `/ministries/${ministry.id}`,
          metadata: {
            category: ministry.category,
          },
        })
      })
    }

    if (searchTypes.includes('blog')) {
      const posts = await prisma.blog.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          excerpt: true,
          createdAt: true,
          category: { select: { name: true } },
        },
      })

      posts.forEach((post) => {
        results.push({
          id: post.id,
          type: 'blog',
          title: post.title,
          description: post.excerpt || '',
          url: `/blog/${post.id}`,
          metadata: {
            date: post.createdAt,
            category: post.category?.name,
          },
        })
      })
    }

    if (searchTypes.includes('gallery')) {
      const items = await prisma.gallery.findMany({
        where: {
          deletedAt: null,
          OR: [
            { caption: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          caption: true,
          imageUrls: true,
        },
      })

      items.forEach((item) => {
        results.push({
          id: item.id,
          type: 'gallery',
          title: item.caption,
          description: '',
          url: `/gallery#${item.id}`,
          metadata: {
            imageUrl: item.imageUrls[0],
          },
        })
      })
    }

    return {
      success: true,
      data: {
        results: results.slice(0, limit * 2),
        total: results.length,
      },
    }
  })
