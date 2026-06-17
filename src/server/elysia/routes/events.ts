import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const eventRoutes = new Elysia({ prefix: '/events' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit
    const upcomingOnly = query.upcoming !== 'false'
    const category = query.category as string | undefined
    const location = query.location as string | undefined
    const search = query.search as string | undefined
    const sort = (query.sort as string) || 'upcoming'
    const status = query.status as string | undefined

    const where: {
      deletedAt: Date | null
      date?: { gte: Date }
      category?: string
      location?: { contains: string; mode: 'insensitive' }
      status?: string
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' }; category?: { contains: string; mode: 'insensitive' } }>
    } = { deletedAt: null }
    
    if (upcomingOnly) where.date = { gte: new Date() }
    if (category) where.category = category
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: { date?: 'asc' | 'desc'; createdAt?: 'desc' } = {}
    if (sort === 'newest') orderBy.createdAt = 'desc'
    else if (sort === 'oldest') orderBy.date = 'desc'
    else orderBy.date = 'asc'

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])
    return { success: true, data: events, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/slug/:slug', async ({ params, set }) => {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug, deletedAt: null },
    })
    if (!event) {
      set.status = 404
      return { success: false, error: 'Event not found' }
    }
    return { success: true, data: event }
  })
  .get('/:id', async ({ params, set }) => {
    const event = await prisma.event.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!event) {
      set.status = 404
      return { success: false, error: 'Event not found' }
    }
    return { success: true, data: event }
  })
  .post('/:id/register', async ({ params, set }) => {
    const event = await prisma.event.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!event) {
      set.status = 404
      return { success: false, error: 'Event not found' }
    }
    if (!event.registrationRequired) {
      return { success: false, error: 'Registration not required for this event' }
    }
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return { success: false, error: 'Registration deadline has passed' }
    }
    // TODO: Create EventRegistration record when model is added
    return { success: true, message: 'Registration submitted' }
  })
  .use(authGuard)
  .use(adminGuard)
  .post(
    '/',
    async ({ body }) => {
      const event = await prisma.event.create({
        data: {
          title: body.title,
          slug: body.slug,
          description: body.description,
          excerpt: body.excerpt,
          date: new Date(body.date),
          endDate: body.endDate ? new Date(body.endDate) : null,
          location: body.location,
          venue: body.venue,
          imageUrl: body.imageUrl,
          category: body.category,
          capacity: body.capacity,
          status: body.status || 'DRAFT',
          registrationRequired: body.registrationRequired,
          registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : null,
        },
      })
      return { success: true, data: event }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 3 }),
        slug: t.String({ minLength: 3 }),
        description: t.Optional(t.String()),
        excerpt: t.Optional(t.String()),
        date: t.String(),
        endDate: t.Optional(t.String()),
        location: t.Optional(t.String()),
        venue: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        category: t.Optional(t.String()),
        capacity: t.Optional(t.Number()),
        status: t.Optional(t.String()),
        registrationRequired: t.Optional(t.Boolean()),
        registrationDeadline: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.event.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Event not found' }
      }

      const event = await prisma.event.update({
        where: { id: params.id },
        data: {
          title: body.title,
          slug: body.slug,
          description: body.description,
          excerpt: body.excerpt,
          date: body.date ? new Date(body.date) : undefined,
          endDate: body.endDate ? new Date(body.endDate) : undefined,
          location: body.location,
          venue: body.venue,
          imageUrl: body.imageUrl,
          category: body.category,
          capacity: body.capacity,
          status: body.status,
          registrationRequired: body.registrationRequired,
          registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : undefined,
        },
      })
      return { success: true, data: event }
    },
    {
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3 })),
        slug: t.Optional(t.String({ minLength: 3 })),
        description: t.Optional(t.String()),
        excerpt: t.Optional(t.String()),
        date: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
        location: t.Optional(t.String()),
        venue: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        category: t.Optional(t.String()),
        capacity: t.Optional(t.Number()),
        status: t.Optional(t.String()),
        registrationRequired: t.Optional(t.Boolean()),
        registrationDeadline: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.event.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Event not found' }
    }

    await prisma.event.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Event deleted' }
  })
