import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'

export const donationRoutes = new Elysia({ prefix: '/donations' })
  .post(
    '/',
    async ({ body }) => {
      const donation = await prisma.donation.create({
        data: {
          amount: body.amount,
          message: body.message,
          donorId: body.donorId,
        },
      })
      return { success: true, data: donation }
    },
    {
      body: t.Object({
        amount: t.Number({ minimum: 1 }),
        message: t.Optional(t.String()),
        donorId: t.Optional(t.String()),
      }),
    }
  )
