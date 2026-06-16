import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'

export const donationRoutes = new Elysia({ prefix: '/api/donations' })
  .get('/', async ({ jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload) return { success: false, error: 'Invalid token' }

    const donations = await prisma.donation.findMany({
      where: { donorId: payload.userId as string },
      include: { donor: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, donations }
  })
  .get('/all', async ({ jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const donations = await prisma.donation.findMany({
      include: { donor: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, donations }
  })
  .post(
    '/',
    async ({ body, jwt, cookie }) => {
      const token = cookie.auth
      if (!token) return { success: false, error: 'Unauthorized' }

      const payload = await jwt.verify(token)
      if (!payload) return { success: false, error: 'Invalid token' }

      const { amount, message } = body

      const donation = await prisma.donation.create({
        data: {
          amount,
          message,
          donorId: payload.userId as string,
        },
      })

      return { success: true, donation }
    },
    {
      body: t.Object({
        amount: t.Number(),
        message: t.Optional(t.String()),
      }),
    }
  )
