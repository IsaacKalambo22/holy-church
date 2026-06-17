import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard } from '../middleware/rbac'

export const memberRoutes = new Elysia({ prefix: '/member' })
  .use(authGuard)
  .get('/dashboard', async ({ jwt, headers }) => {
    const auth = headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return { success: false, error: 'Unauthorized' }
    }

    const payload = await jwt.verify(auth.slice(7))
    if (!payload) {
      return { success: false, error: 'Invalid token' }
    }

    const userId = payload.userId as string

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const [
      upcomingEvents,
      recentPrayerRequests,
      recentDonations,
      preferences,
    ] = await Promise.all([
      prisma.event.findMany({
        where: {
          deletedAt: null,
          date: { gte: new Date() },
        },
        orderBy: { date: 'asc' },
        take: 3,
      }),
      prisma.prayerRequest.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.donation.findMany({
        where: { donorId: userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.memberPreference.findUnique({
        where: { userId },
      }),
    ])

    const totalDonations = await prisma.donation.aggregate({
      where: { donorId: userId, deletedAt: null, paymentStatus: 'COMPLETED' },
      _sum: { amount: true },
      _count: true,
    })

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        upcomingEvents,
        recentPrayerRequests,
        recentDonations,
        preferences,
        givingSummary: {
          total: totalDonations._sum.amount || 0,
          count: totalDonations._count,
        },
      },
    }
  })
  .get('/activity', async ({ jwt, headers, query }) => {
    const auth = headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return { success: false, error: 'Unauthorized' }
    }

    const payload = await jwt.verify(auth.slice(7))
    if (!payload) {
      return { success: false, error: 'Invalid token' }
    }

    const userId = payload.userId as string
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit

    const activities: Array<{
      id: string
      type: 'prayer_request' | 'donation'
      title: string
      description: string
      date: Date
      status: string
    }> = []

    const [prayerRequests, donations] = await Promise.all([
      prisma.prayerRequest.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.donation.findMany({
        where: { donorId: userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
    ])

    prayerRequests.forEach((pr) => {
      activities.push({
        id: pr.id,
        type: 'prayer_request',
        title: 'Prayer Request',
        description: pr.request.substring(0, 100),
        date: pr.createdAt,
        status: pr.status,
      })
    })

    donations.forEach((d) => {
      activities.push({
        id: d.id,
        type: 'donation',
        title: `Donation to ${d.category}`,
        description: `MWK ${d.amount.toLocaleString()}`,
        date: d.createdAt,
        status: d.paymentStatus,
      })
    })

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      success: true,
      data: activities.slice(0, limit),
      total: activities.length,
      page,
      limit,
    }
  })
  .get('/preferences', async ({ jwt, headers }) => {
    const auth = headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return { success: false, error: 'Unauthorized' }
    }

    const payload = await jwt.verify(auth.slice(7))
    if (!payload) {
      return { success: false, error: 'Invalid token' }
    }

    const userId = payload.userId as string

    const preferences = await prisma.memberPreference.findUnique({
      where: { userId },
    })

    if (!preferences) {
      const newPreferences = await prisma.memberPreference.create({
        data: { userId },
      })
      return { success: true, data: newPreferences }
    }

    return { success: true, data: preferences }
  })
  .patch(
    '/preferences',
    async ({ jwt, headers, body }) => {
      const auth = headers.authorization
      if (!auth?.startsWith('Bearer ')) {
        return { success: false, error: 'Unauthorized' }
      }

      const payload = await jwt.verify(auth.slice(7))
      if (!payload) {
        return { success: false, error: 'Invalid token' }
      }

      const userId = payload.userId as string

      const preferences = await prisma.memberPreference.upsert({
        where: { userId },
        create: {
          userId,
          emailNotifications: body.emailNotifications ?? true,
          smsNotifications: body.smsNotifications ?? false,
          newsletterSubscription: body.newsletterSubscription ?? true,
          showProfile: body.showProfile ?? true,
          showEmail: body.showEmail ?? false,
          showPhone: body.showPhone ?? false,
        },
        update: {
          emailNotifications: body.emailNotifications,
          smsNotifications: body.smsNotifications,
          newsletterSubscription: body.newsletterSubscription,
          showProfile: body.showProfile,
          showEmail: body.showEmail,
          showPhone: body.showPhone,
        },
      })

      return { success: true, data: preferences }
    },
    {
      body: t.Object({
        emailNotifications: t.Optional(t.Boolean()),
        smsNotifications: t.Optional(t.Boolean()),
        newsletterSubscription: t.Optional(t.Boolean()),
        showProfile: t.Optional(t.Boolean()),
        showEmail: t.Optional(t.Boolean()),
        showPhone: t.Optional(t.Boolean()),
      }),
    }
  )
