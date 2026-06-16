import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'

export const adminRoutes = new Elysia({ prefix: '/api/admin' })
  .get('/dashboard', async ({ jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const [userCount, sermonCount, eventCount, galleryCount, donationCount, blogCount, prayerCount, podcastCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.sermon.count(),
        prisma.event.count(),
        prisma.gallery.count(),
        prisma.donation.count(),
        prisma.blog.count(),
        prisma.prayerRequest.count(),
        prisma.podcast.count(),
      ])

    return {
      success: true,
      stats: {
        users: userCount,
        sermons: sermonCount,
        events: eventCount,
        galleries: galleryCount,
        donations: donationCount,
        blogs: blogCount,
        prayerRequests: prayerCount,
        podcasts: podcastCount,
      },
    }
  })
  .get('/users', async ({ jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, users }
  })
  .put(
    '/users/:id/role',
    async ({ params, body, jwt, cookie }) => {
      const token = cookie.auth
      if (!token) return { success: false, error: 'Unauthorized' }

      const payload = await jwt.verify(token)
      if (!payload || (payload.role as string) !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' }
      }

      const { role } = body

      const user = await prisma.user.update({
        where: { id: params.id },
        data: { role },
      })

      return { success: true, user }
    },
    {
      body: t.Object({
        role: t.Union([t.Literal('SUPER_ADMIN'), t.Literal('ADMIN'), t.Literal('MEMBER')]),
      }),
    }
  )
