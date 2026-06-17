import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'

export const donationRoutes = new Elysia({ prefix: '/donations' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const fund = query.fund as string | undefined
    const donorId = query.donorId as string | undefined

    const where: { deletedAt: Date | null; fund?: string; donorId?: string } = { deletedAt: null }
    if (fund) where.fund = fund
    if (donorId) where.donorId = donorId

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
          fund: body.fund || 'general',
          message: body.message,
          donorId: body.donorId,
        },
      })
      return { success: true, data: donation }
    },
    {
      body: t.Object({
        amount: t.Number({ minimum: 1 }),
        fund: t.Optional(t.String()),
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
          fund: body.fund,
          message: body.message,
          donorId: body.donorId,
        },
      })
      return { success: true, data: donation }
    },
    {
      body: t.Object({
        amount: t.Optional(t.Number({ minimum: 1 })),
        fund: t.Optional(t.String()),
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
