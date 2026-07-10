import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard } from '../middleware/rbac'
import { getTokenFromHeaders } from '@/lib/auth-cookie'

type Headers = { authorization?: string; cookie?: string }
type Verify = (t: string) => Promise<unknown>

// Resolve the authenticated user id from either the HttpOnly cookie or a Bearer
// header. The route is already protected by authGuard; this just reads the id.
async function getUserId(headers: Headers, verify: Verify): Promise<string | null> {
  const token = getTokenFromHeaders(headers)
  if (!token) return null
  const payload = (await verify(token)) as { userId?: string } | false
  return payload && payload.userId ? payload.userId : null
}

export const memberRoutes = new Elysia({ prefix: '/member' })
  .use(authGuard)
  .get('/dashboard', async ({ jwt, headers, set }) => {
    const userId = await getUserId(headers, jwt.verify)
    if (!userId) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      set.status = 404
      return { success: false, error: 'User not found' }
    }

    const [upcomingEvents, recentPrayerRequests, recentDonations, preferences] = await Promise.all([
      prisma.event.findMany({
        where: { deletedAt: null, date: { gte: new Date() } },
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
      prisma.memberPreference.findUnique({ where: { userId } }),
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
          learningTrack: user.learningTrack,
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
  .get('/learning', async ({ jwt, headers, set }) => {
    const userId = await getUserId(headers, jwt.verify)
    if (!userId) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, learningTrack: true },
    })
    if (!user) {
      set.status = 404
      return { success: false, error: 'User not found' }
    }

    const publishedCourse = { deletedAt: null, published: true } as const
    const lessonCount = {
      _count: { select: { lessons: { where: { deletedAt: null, published: true } } } },
    } as const

    const [trackCourses, otherCourses, latestSermons, latestPodcasts] = await Promise.all([
      // Courses matched to the member's chosen track (empty when "just exploring").
      user.learningTrack
        ? prisma.course.findMany({
            where: { ...publishedCourse, category: user.learningTrack },
            orderBy: { createdAt: 'desc' },
            take: 12,
            include: lessonCount,
          })
        : Promise.resolve([]),
      // Everything else, so a member can always keep exploring beyond their track.
      prisma.course.findMany({
        where: {
          ...publishedCourse,
          ...(user.learningTrack ? { NOT: { category: user.learningTrack } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: 12,
        include: lessonCount,
      }),
      prisma.sermon.findMany({
        where: { deletedAt: null, published: true },
        orderBy: { date: 'desc' },
        take: 5,
        select: {
          id: true, title: true, slug: true, description: true,
          thumbnailUrl: true, date: true, series: true, audioUrl: true, videoUrl: true,
        },
      }),
      prisma.podcast.findMany({
        where: { deletedAt: null, published: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 5,
        select: {
          id: true, title: true, description: true,
          thumbnailUrl: true, audioUrl: true, videoUrl: true, duration: true, publishedAt: true,
        },
      }),
    ])

    return {
      success: true,
      data: {
        learningTrack: user.learningTrack,
        trackCourses: trackCourses.map((c) => ({ ...c, lessonCount: c._count.lessons })),
        otherCourses: otherCourses.map((c) => ({ ...c, lessonCount: c._count.lessons })),
        latestSermons,
        latestPodcasts,
      },
    }
  })
  .get('/activity', async ({ jwt, headers, query, set }) => {
    const userId = await getUserId(headers, jwt.verify)
    if (!userId) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }

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
  .get('/preferences', async ({ jwt, headers, set }) => {
    const userId = await getUserId(headers, jwt.verify)
    if (!userId) {
      set.status = 401
      return { success: false, error: 'Unauthorized' }
    }

    const preferences = await prisma.memberPreference.findUnique({ where: { userId } })
    if (!preferences) {
      const newPreferences = await prisma.memberPreference.create({ data: { userId } })
      return { success: true, data: newPreferences }
    }

    return { success: true, data: preferences }
  })
  .patch(
    '/preferences',
    async ({ jwt, headers, body, set }) => {
      const userId = await getUserId(headers, jwt.verify)
      if (!userId) {
        set.status = 401
        return { success: false, error: 'Unauthorized' }
      }

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
