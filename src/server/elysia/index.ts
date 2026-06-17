import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { authRoutes } from './routes/auth'
import { sermonRoutes } from './routes/sermons'
import { eventRoutes } from './routes/events'
import { prayerRoutes } from './routes/prayer'
import { blogRoutes } from './routes/blog'
import { donationRoutes } from './routes/donations'
import { galleryRoutes } from './routes/gallery'
import { contactRoutes } from './routes/contact'

export const app = new Elysia({ prefix: '/api' })
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      credentials: true,
    })
  )
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'holy-church-dev-secret',
    })
  )
  .get('/health', () => ({ status: 'ok', service: 'Holy Church Assembly API' }))
  .use(authRoutes)
  .use(sermonRoutes)
  .use(eventRoutes)
  .use(prayerRoutes)
  .use(blogRoutes)
  .use(donationRoutes)
  .use(galleryRoutes)
  .use(contactRoutes)
