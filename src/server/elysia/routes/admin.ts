import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { adminGuard } from '../middleware/rbac'

export const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(adminGuard)
  .get('/overview', async ({ jwt, headers }) => {
    const auth = headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return { success: false, error: 'Unauthorized' }
    }

    const payload = await jwt.verify(auth.slice(7))
    if (!payload) {
      return { success: false, error: 'Invalid token' }
    }

    const [
      totalMembers,
      activeMembers,
      totalEvents,
      upcomingEvents,
      totalPrayerRequests,
      pendingPrayerRequests,
      totalDonations,
      completedDonations,
      totalSermons,
      publishedSermons,
      totalBlogs,
      publishedBlogs,
      totalMinistries,
      activeMinistries,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null, isVerified: true } }),
      prisma.event.count({ where: { deletedAt: null } }),
      prisma.event.count({ where: { deletedAt: null, date: { gte: new Date() } } }),
      prisma.prayerRequest.count({ where: { deletedAt: null } }),
      prisma.prayerRequest.count({ where: { deletedAt: null, status: 'PENDING' } }),
      prisma.donation.count({ where: { deletedAt: null } }),
      prisma.donation.count({ where: { deletedAt: null, paymentStatus: 'COMPLETED' } }),
      prisma.sermon.count({ where: { deletedAt: null } }),
      prisma.sermon.count({ where: { deletedAt: null, published: true } }),
      prisma.blog.count({ where: { deletedAt: null } }),
      prisma.blog.count({ where: { deletedAt: null, status: 'PUBLISHED' } }),
      prisma.ministry.count({ where: { deletedAt: null } }),
      prisma.ministry.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { actor: { select: { id: true, name: true, email: true } } },
      }),
    ])

    const donationTotal = await prisma.donation.aggregate({
      where: { deletedAt: null, paymentStatus: 'COMPLETED' },
      _sum: { amount: true },
    })

    return {
      success: true,
      data: {
        metrics: {
          members: { total: totalMembers, active: activeMembers },
          events: { total: totalEvents, upcoming: upcomingEvents },
          prayers: { total: totalPrayerRequests, pending: pendingPrayerRequests },
          donations: { total: totalDonations, completed: completedDonations, amount: donationTotal._sum.amount || 0 },
          sermons: { total: totalSermons, published: publishedSermons },
          blogs: { total: totalBlogs, published: publishedBlogs },
          ministries: { total: totalMinistries, active: activeMinistries },
        },
        recentActivity,
      },
    }
  })
  .get('/members', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const role = query.role as 'SUPER_ADMIN' | 'ADMIN' | 'PASTOR' | 'MINISTRY_LEADER' | 'CONTENT_MANAGER' | 'FINANCE_MANAGER' | 'MEMBER' | undefined
    const search = query.search as string | undefined

    const where: { deletedAt: Date | null; role?: 'SUPER_ADMIN' | 'ADMIN' | 'PASTOR' | 'MINISTRY_LEADER' | 'CONTENT_MANAGER' | 'FINANCE_MANAGER' | 'MEMBER'; OR?: Array<{ name?: { contains: string }; email?: { contains: string } }> } = { deletedAt: null }
    
    if (role) where.role = role
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return {
      success: true,
      data: members,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  })
  .patch(
    '/members/:id/role',
    async ({ params, body }) => {
      const user = await prisma.user.update({
        where: { id: params.id, deletedAt: null },
        data: { role: body.role as 'SUPER_ADMIN' | 'ADMIN' | 'PASTOR' | 'MINISTRY_LEADER' | 'CONTENT_MANAGER' | 'FINANCE_MANAGER' | 'MEMBER' },
      })

      await prisma.auditLog.create({
        data: {
          actorId: body.actorId,
          action: 'UPDATE_ROLE',
          entity: 'User',
          entityId: params.id,
          metadata: { oldRole: body.oldRole, newRole: body.role },
        },
      })

      return { success: true, data: user }
    },
    {
      body: t.Object({
        role: t.String(),
        actorId: t.String(),
        oldRole: t.String(),
      }),
    }
  )
  .get('/audit-logs', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 50
    const skip = (page - 1) * limit
    const action = query.action as string | undefined
    const entity = query.entity as string | undefined

    const where: { action?: string; entity?: string } = {}
    if (action) where.action = action
    if (entity) where.entity = entity

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { actor: { select: { id: true, name: true, email: true } } },
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      success: true,
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  })
