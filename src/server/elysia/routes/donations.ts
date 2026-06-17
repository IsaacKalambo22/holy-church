import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const donationRoutes = new Elysia({ prefix: '/donations' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const category = query.category as string | undefined
    const donorId = query.donorId as string | undefined
    const paymentStatus = query.paymentStatus as string | undefined

    const where: {
      deletedAt: Date | null
      category?: string
      donorId?: string
      paymentStatus?: string
    } = { deletedAt: null }
    
    if (category) where.category = category
    if (donorId) where.donorId = donorId
    if (paymentStatus) where.paymentStatus = paymentStatus

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { donor: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.donation.count({ where }),
    ])
    return { success: true, data: donations, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/categories', async () => {
    const categories = await prisma.donationCategory.findMany({
      orderBy: { name: 'asc' },
    })
    return { success: true, data: categories }
  })
  .get('/reports', async ({ query }) => {
    const startDate = query.startDate as string | undefined
    const endDate = query.endDate as string | undefined

    const where: { deletedAt: Date | null; createdAt?: { gte?: Date; lte?: Date } } = { deletedAt: null }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const [totalDonations, categoryBreakdown, recentDonations] = await Promise.all([
      prisma.donation.aggregate({
        where: { ...where, paymentStatus: 'COMPLETED' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.donation.groupBy({
        by: ['category'],
        where: { ...where, paymentStatus: 'COMPLETED' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.donation.findMany({
        where: { ...where, paymentStatus: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { donor: { select: { id: true, name: true, avatar: true } } },
      }),
    ])

    return {
      success: true,
      data: {
        total: totalDonations._sum.amount || 0,
        count: totalDonations._count,
        byCategory: categoryBreakdown,
        recent: recentDonations,
      },
    }
  })
  .get('/:id', async ({ params, set }) => {
    const donation = await prisma.donation.findUnique({
      where: { id: params.id, deletedAt: null },
      include: { donor: { select: { id: true, name: true, avatar: true } } },
    })
    if (!donation) {
      set.status = 404
      return { success: false, error: 'Donation not found' }
    }
    return { success: true, data: donation }
  })
  .post(
    '/',
    async ({ body }) => {
      const donation = await prisma.donation.create({
        data: {
          amount: body.amount,
          currency: body.currency || 'MWK',
          category: body.category || 'general',
          paymentStatus: body.paymentStatus || 'PENDING',
          transactionId: body.transactionId,
          donorName: body.donorName,
          donorEmail: body.donorEmail,
          isAnonymous: body.isAnonymous || false,
          message: body.message,
          donorId: body.donorId,
        },
      })
      return { success: true, data: donation }
    },
    {
      body: t.Object({
        amount: t.Number({ minimum: 1 }),
        currency: t.Optional(t.String()),
        category: t.Optional(t.String()),
        paymentStatus: t.Optional(t.Union([t.Literal('PENDING'), t.Literal('COMPLETED'), t.Literal('FAILED'), t.Literal('REFUNDED')])),
        transactionId: t.Optional(t.String()),
        donorName: t.Optional(t.String()),
        donorEmail: t.Optional(t.String()),
        isAnonymous: t.Optional(t.Boolean()),
        message: t.Optional(t.String()),
        donorId: t.Optional(t.String()),
      }),
    }
  )
  .use(authGuard)
  .use(adminGuard)
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.donation.findUnique({
        where: { id: params.id, deletedAt: null },
      })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Donation not found' }
      }

      const donation = await prisma.donation.update({
        where: { id: params.id },
        data: {
          amount: body.amount,
          currency: body.currency,
          category: body.category,
          paymentStatus: body.paymentStatus,
          transactionId: body.transactionId,
          donorName: body.donorName,
          donorEmail: body.donorEmail,
          isAnonymous: body.isAnonymous,
          message: body.message,
          donorId: body.donorId,
        },
      })
      return { success: true, data: donation }
    },
    {
      body: t.Object({
        amount: t.Optional(t.Number({ minimum: 1 })),
        currency: t.Optional(t.String()),
        category: t.Optional(t.String()),
        paymentStatus: t.Optional(t.Union([t.Literal('PENDING'), t.Literal('COMPLETED'), t.Literal('FAILED'), t.Literal('REFUNDED')])),
        transactionId: t.Optional(t.String()),
        donorName: t.Optional(t.String()),
        donorEmail: t.Optional(t.String()),
        isAnonymous: t.Optional(t.Boolean()),
        message: t.Optional(t.String()),
        donorId: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.donation.findUnique({
      where: { id: params.id, deletedAt: null },
    })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Donation not found' }
    }

    await prisma.donation.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })
    return { success: true, message: 'Donation deleted' }
  })
  // Category management (admin only)
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

      const category = await prisma.donationCategory.create({
        data: {
          name: body.name,
          slug,
          description: body.description,
        },
      })
      return { success: true, data: category }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String()),
      }),
    }
  )
