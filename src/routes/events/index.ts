import { Elysia, t } from 'elysia'
import { prisma } from '../../prisma'

export const eventRoutes = new Elysia({ prefix: '/api/events' })
  .get('/', async () => {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    })
    return { success: true, events }
  })
  .get('/:id', async ({ params }) => {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    })

    if (!event) {
      return { success: false, error: 'Event not found' }
    }

    return { success: true, event }
  })
  .post(
    '/',
    async ({ body, jwt, cookie }) => {
      const token = cookie.auth
      if (!token) return { success: false, error: 'Unauthorized' }

      const payload = await jwt.verify(token)
      if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' }
      }

      const { title, description, date, location, imageUrl } = body

      const event = await prisma.event.create({
        data: {
          title,
          description,
          date: new Date(date),
          location,
          imageUrl,
        },
      })

      return { success: true, event }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        date: t.String(),
        location: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, jwt, cookie }) => {
      const token = cookie.auth
      if (!token) return { success: false, error: 'Unauthorized' }

      const payload = await jwt.verify(token)
      if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' }
      }

      const event = await prisma.event.update({
        where: { id: params.id },
        data: {
          ...body,
          date: body.date ? new Date(body.date) : undefined,
        },
      })

      return { success: true, event }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        date: t.Optional(t.String()),
        location: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:id', async ({ params, jwt, cookie }) => {
    const token = cookie.auth
    if (!token) return { success: false, error: 'Unauthorized' }

    const payload = await jwt.verify(token)
    if (!payload || (payload.role as string) !== 'ADMIN' && (payload.role as string) !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.event.delete({
      where: { id: params.id },
    })

    return { success: true }
  })
