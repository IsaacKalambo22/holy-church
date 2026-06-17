import { Elysia } from 'elysia'
import { prisma } from '@/lib/prisma'

export const eventRoutes = new Elysia({ prefix: '/events' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where: { date: { gte: new Date() } } }),
    ])
    return { success: true, data: events, total, page, limit }
  })
  .get('/:id', async ({ params, set }) => {
    const event = await prisma.event.findUnique({ where: { id: params.id } })
    if (!event) { set.status = 404; return { success: false, error: 'Event not found' } }
    return { success: true, data: event }
  })
