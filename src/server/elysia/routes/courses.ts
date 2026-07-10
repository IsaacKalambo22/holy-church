import { Elysia, t } from 'elysia'
import { prisma } from '@/lib/prisma'
import { contentGuard } from '../middleware/rbac'

// Courses group ordered lessons into a learning track (e.g. "Beginners",
// "Ministers"). Public reads return only published courses/lessons; all
// mutations require content-managing staff (contentGuard). Viewing on the
// public site is login-gated at the page level, not here.
export const courseRoutes = new Elysia({ prefix: '/courses' })
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 50
    const skip = (page - 1) * limit
    const category = query.category as string | undefined
    const search = query.search as string | undefined
    // `admin=1` returns unpublished courses too (used by the admin manager).
    const includeUnpublished = query.admin === '1' || query.admin === 'true'

    const where: {
      deletedAt: Date | null
      published?: boolean
      category?: string
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>
    } = { deletedAt: null }

    if (!includeUnpublished) where.published = true
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: { select: { lessons: { where: { deletedAt: null, published: true } } } },
        },
      }),
      prisma.course.count({ where }),
    ])
    const data = courses.map((c) => ({ ...c, lessonCount: c._count.lessons }))
    return { success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
  .get('/slug/:slug', async ({ params, set }) => {
    const course = await prisma.course.findFirst({
      where: { slug: params.slug, deletedAt: null, published: true },
      include: {
        lessons: {
          where: { deletedAt: null, published: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
      },
    })
    if (!course) {
      set.status = 404
      return { success: false, error: 'Course not found' }
    }
    return { success: true, data: course }
  })
  .get('/:id', async ({ params, set }) => {
    const course = await prisma.course.findFirst({
      where: { id: params.id, deletedAt: null },
      include: {
        lessons: { where: { deletedAt: null }, orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] },
      },
    })
    if (!course) {
      set.status = 404
      return { success: false, error: 'Course not found' }
    }
    return { success: true, data: course }
  })
  .use(contentGuard)
  .post(
    '/',
    async ({ body }) => {
      const course = await prisma.course.create({
        data: {
          title: body.title,
          slug: body.slug,
          description: body.description,
          category: body.category,
          imageUrl: body.imageUrl,
          published: body.published ?? false,
        },
      })
      return { success: true, data: course }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 3 }),
        slug: t.String({ minLength: 3 }),
        description: t.Optional(t.String()),
        category: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.course.findFirst({ where: { id: params.id, deletedAt: null } })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Course not found' }
      }
      const course = await prisma.course.update({
        where: { id: params.id },
        data: {
          title: body.title,
          slug: body.slug,
          description: body.description,
          category: body.category,
          imageUrl: body.imageUrl,
          published: body.published,
        },
      })
      return { success: true, data: course }
    },
    {
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3 })),
        slug: t.Optional(t.String({ minLength: 3 })),
        description: t.Optional(t.String()),
        category: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.course.findFirst({ where: { id: params.id, deletedAt: null } })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Course not found' }
    }
    await prisma.course.update({ where: { id: params.id }, data: { deletedAt: new Date() } })
    return { success: true, message: 'Course deleted' }
  })

// Lessons are managed as a flat resource keyed by courseId so the admin
// ResourceManager can drive standard CRUD against /api/lessons.
export const lessonRoutes = new Elysia({ prefix: '/lessons' })
  .get('/', async ({ query }) => {
    const courseId = query.courseId as string | undefined
    const lessons = await prisma.lesson.findMany({
      where: { deletedAt: null, ...(courseId ? { courseId } : {}) },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      take: Number(query.limit) || 200,
      include: { course: { select: { id: true, title: true } } },
    })
    return { success: true, data: lessons }
  })
  .use(contentGuard)
  .post(
    '/',
    async ({ body, set }) => {
      const course = await prisma.course.findFirst({ where: { id: body.courseId, deletedAt: null } })
      if (!course) {
        set.status = 400
        return { success: false, error: 'Selected course does not exist' }
      }
      const lesson = await prisma.lesson.create({
        data: {
          courseId: body.courseId,
          title: body.title,
          description: body.description,
          videoUrl: body.videoUrl,
          order: body.order ?? 0,
          published: body.published ?? true,
        },
      })
      return { success: true, data: lesson }
    },
    {
      body: t.Object({
        courseId: t.String({ minLength: 1 }),
        title: t.String({ minLength: 2 }),
        description: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const existing = await prisma.lesson.findFirst({ where: { id: params.id, deletedAt: null } })
      if (!existing) {
        set.status = 404
        return { success: false, error: 'Lesson not found' }
      }
      const lesson = await prisma.lesson.update({
        where: { id: params.id },
        data: {
          courseId: body.courseId,
          title: body.title,
          description: body.description,
          videoUrl: body.videoUrl,
          order: body.order,
          published: body.published,
        },
      })
      return { success: true, data: lesson }
    },
    {
      body: t.Object({
        courseId: t.Optional(t.String({ minLength: 1 })),
        title: t.Optional(t.String({ minLength: 2 })),
        description: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        published: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const existing = await prisma.lesson.findFirst({ where: { id: params.id, deletedAt: null } })
    if (!existing) {
      set.status = 404
      return { success: false, error: 'Lesson not found' }
    }
    await prisma.lesson.update({ where: { id: params.id }, data: { deletedAt: new Date() } })
    return { success: true, message: 'Lesson deleted' }
  })
