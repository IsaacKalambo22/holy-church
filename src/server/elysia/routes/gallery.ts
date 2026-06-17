import { Elysia } from 'elysia'
import { prisma } from '@/lib/prisma'

export const galleryRoutes = new Elysia({ prefix: '/gallery' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      prisma.gallery.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.gallery.count(),
    ])
    return { success: true, data: items, total, page, limit }
  })
