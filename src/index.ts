import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'
import { cookie } from '@elysiajs/cookie'
import { jwt } from '@elysiajs/jwt'
import { node } from '@elysiajs/node'

import { authRoutes } from './routes/auth'
import { sermonRoutes } from './routes/sermons'
import { eventRoutes } from './routes/events'
import { galleryRoutes } from './routes/gallery'
import { donationRoutes } from './routes/donations'
import { blogRoutes } from './routes/blog'
import { prayerRoutes } from './routes/prayer'
import { podcastRoutes } from './routes/podcasts'
import { adminRoutes } from './routes/admin'
import { pageRoutes } from './routes/pages/index'

const port = Number(process.env.PORT) || 3000

const app = new Elysia({ adapter: node() })
  .use(cors())
  .use(staticPlugin({ assets: 'public', prefix: '/' }))
  .use(cookie())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'your-secret-key',
    })
  )
  .get('/', () => 'Holy Church Platform API')
  .use(authRoutes)
  .use(sermonRoutes)
  .use(eventRoutes)
  .use(galleryRoutes)
  .use(donationRoutes)
  .use(blogRoutes)
  .use(prayerRoutes)
  .use(podcastRoutes)
  .use(adminRoutes)
  .use(pageRoutes)
  .listen(port)

console.log(`🦊 Elysia is running at http://localhost:${port}`)
