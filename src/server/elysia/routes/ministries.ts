import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const ministryRoutes = new Elysia({ prefix: '/ministries' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit
    const category = query.category as string | undefined
    const search = query.search as string | undefined
    const sort = (query.sort as string) || 'name'
    const status = query.status as string | undefined

    const where: {
      deletedAt: Date | null
      category?: string
      status?: string
      OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>
    } = { deletedAt: null }
    
    if (category) where.category = category
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: { name?: 'asc' | 'desc'; createdAt?: 'desc' } = {}
    if (sort === 'newest') orderBy.createdAt = 'desc'
    else orderBy.name = 'asc'

    const [ministries, total] = await Promise.all([
      prisma.ministry.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          leader: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),
      prisma.ministry.count({ where }),
    ])
    return { success: true, data: ministries, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/slug/:slug', async ({ params, set }) => {
    const ministry = await prisma.ministry.findUnique({
      where: { slug: params.slug, deletedAt: null },
      include: {
        leader: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })
    if (!ministry) {
      set.status = 404
      return { success: false, error: 'Ministry not found' }
    }
    return { success: true, data: ministry }
  })
  .get('/:id', async ({ params, set }) => {
    const ministry = await prisma.ministry.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        leader: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })
    if (!ministry) {
      set.status = 404
      return { success: false, error: 'Ministry not found' }
    }
    return { success: true, data: ministry }
  })
  .post('/:id/volunteer', async ({ params, set }) => {
    const ministry = await prisma.ministry.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!ministry) {
      set.status = 404
      return { success: false, error: 'Ministry not found' }
    }
    if (!ministry.volunteerRequired) {
      return { success: false, error: 'This ministry is not currently accepting volunteers' }
    }
    // TODO: Create Volunteer record when model is added
    return { success: true, message: 'Volunteer signup submitted' }
  })
  .use(authGuard)
  .use(adminGuard)
  .post(
    '/',
    async ({ body }) => {
      const ministry = await prisma.ministry.create({
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description,
          imageUrl: body.imageUrl,
          category: body.category,
          status: body.status || 'ACTIVE',
          meetingSchedule: body.meetingSchedule,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          volunteerRequired: body.volunteerRequired,
          leaderId: body.leaderId,
        },
      })
      return { success: true, data: ministry }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        slug: t.String({ minLength: 3 }),
        description: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        category: t.Optional(t.String()),
        status: t.Optional(t.String()),
        meetingSchedule: t.Optional(t.String()),
        contactEmail: t.Optional(t.String()),
        contactPhone: t.Optional(t.String()),
        volunteerRequired: t.Optional(t.Boolean()),
        leaderId: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.ministry.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Ministry not found' }
      }

      const ministry = await prisma.ministry.update({
        where: { id: params.id },
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description,
          imageUrl: body.imageUrl,
          category: body.category,
          status: body.status,
          meetingSchedule: body.meetingSchedule,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          volunteerRequired: body.volunteerRequired,
          leaderId: body.leaderId,
        },
      })
      return { success: true, data: ministry }
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 3 })),
        slug: t.Optional(t.String({ minLength: 3 })),
        description: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        category: t.Optional(t.String()),
        status: t.Optional(t.String()),
        meetingSchedule: t.Optional(t.String()),
        contactEmail: t.Optional(t.String()),
        contactPhone: t.Optional(t.String()),
        volunteerRequired: t.Optional(t.Boolean()),
        leaderId: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.ministry.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Ministry not found' }
    }

    await prisma.ministry.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Ministry deleted' }
  })
