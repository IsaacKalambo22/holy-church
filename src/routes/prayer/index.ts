import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'

export const prayerRoutes = new Elysia({ prefix: '/api/prayer' })
  .get('/', async ({ jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload) return { success: false, error: 'Invalid token' }

    const prayerRequests = await prisma.prayerRequest.findMany({
      where: { userId: payload.userId as string },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, prayerRequests }
  })
  .get('/all', async ({ jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const prayerRequests = await prisma.prayerRequest.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, prayerRequests }
  })
  .post(
    '/',
    async ({ body, jwt, cookie }) => {
      const token = cookie.auth
      if (!token) return { success: false, error: 'Unauthorized' }

      const payload = await jwt.verify(token)
      if (!payload) return { success: false, error: 'Invalid token' }

      const { request, isAnonymous } = body

      const prayerRequest = await prisma.prayerRequest.create({
        data: {
          request,
          isAnonymous,
          userId: isAnonymous ? null : (payload.userId as string),
        },
      })

      return { success: true, prayerRequest }
    },
    {
      body: t.Object({
        request: t.String(),
        isAnonymous: t.Optional(t.Boolean()),
      }),
    }
  )
