import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { authGuard, adminGuard } from '../middleware/rbac'
import { getTokenFromHeaders } from '@/lib/auth-cookie'

export const notificationRoutes = new Elysia({ prefix: '/notifications' })
  .use(authGuard)
  .get('/', async ({ jwt, headers, query }) => {
    const token = getTokenFromHeaders(headers)
    const payload = token ? ((await jwt.verify(token)) as { userId?: string } | false) : null
    if (!payload || !payload.userId) {
      return { success: false, error: 'Unauthorized' }
    }
    const userId = payload.userId
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit
    const unreadOnly = query.unreadOnly === 'true'

    const where: { userId: string; read?: boolean } = { userId }
    if (unreadOnly) where.read = false

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
    ])

    return {
      success: true,
      data: notifications,
      total,
      unreadCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  })
  .patch('/:id/read', async ({ jwt, headers, params }) => {
    const token = getTokenFromHeaders(headers)
    const payload = token ? ((await jwt.verify(token)) as { userId?: string } | false) : null
    if (!payload || !payload.userId) {
      return { success: false, error: 'Unauthorized' }
    }
    const userId = payload.userId

    const notification = await prisma.notification.update({
      where: { id: params.id, userId },
      data: { read: true },
    })

    return { success: true, data: notification }
  })
  .patch('/read-all', async ({ jwt, headers }) => {
    const token = getTokenFromHeaders(headers)
    const payload = token ? ((await jwt.verify(token)) as { userId?: string } | false) : null
    if (!payload || !payload.userId) {
      return { success: false, error: 'Unauthorized' }
    }
    const userId = payload.userId

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })

    return { success: true }
  })
  .delete('/:id', async ({ jwt, headers, params }) => {
    const token = getTokenFromHeaders(headers)
    const payload = token ? ((await jwt.verify(token)) as { userId?: string } | false) : null
    if (!payload || !payload.userId) {
      return { success: false, error: 'Unauthorized' }
    }
    const userId = payload.userId

    await prisma.notification.delete({
      where: { id: params.id, userId },
    })

    return { success: true }
  })
  .use(adminGuard)
  .post(
    '/broadcast',
    async ({ body }) => {
      const { title, message, type, channel, targetRoles, targetUsers } = body

      let userIds: string[] = []

      if (targetUsers && targetUsers.length > 0) {
        userIds = targetUsers
      } else if (targetRoles && targetRoles.length > 0) {
        const users = await prisma.user.findMany({
          where: { role: { in: targetRoles as ('SUPER_ADMIN' | 'ADMIN' | 'PASTOR' | 'MINISTRY_LEADER' | 'CONTENT_MANAGER' | 'FINANCE_MANAGER' | 'MEMBER')[] }, deletedAt: null },
          select: { id: true },
        })
        userIds = users.map((u) => u.id)
      } else {
        const users = await prisma.user.findMany({
          where: { deletedAt: null },
          select: { id: true },
        })
        userIds = users.map((u) => u.id)
      }

      const notifications = await prisma.notification.createMany({
        data: userIds.map((userId) => ({
          userId,
          title,
          message,
          type: type as 'SYSTEM' | 'EVENT' | 'SERMON' | 'PRAYER' | 'DONATION' | 'BLOG' | 'ANNOUNCEMENT',
          channel: channel as 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH',
        })),
      })

      return { success: true, data: { sent: notifications.count } }
    },
    {
      body: t.Object({
        title: t.String(),
        message: t.String(),
        type: t.String(),
        channel: t.String(),
        targetRoles: t.Optional(t.Array(t.String())),
        targetUsers: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .get('/templates', async () => {
    const templates = await prisma.notificationTemplate.findMany({
      where: { active: true },
      orderBy: { type: 'asc' },
    })

    return { success: true, data: templates }
  })
  .post(
    '/templates',
    async ({ body }) => {
      const template = await prisma.notificationTemplate.create({
        data: {
          name: body.name,
          type: body.type as 'SYSTEM' | 'EVENT' | 'SERMON' | 'PRAYER' | 'DONATION' | 'BLOG' | 'ANNOUNCEMENT',
          subject: body.subject,
          body: body.body,
          variables: body.variables,
        },
      })

      return { success: true, data: template }
    },
    {
      body: t.Object({
        name: t.String(),
        type: t.String(),
        subject: t.String(),
        body: t.String(),
        variables: t.Array(t.String()),
      }),
    }
  )
