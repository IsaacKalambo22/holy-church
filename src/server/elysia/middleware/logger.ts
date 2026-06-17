import { Elysia } from 'elysia'

export const logger = new Elysia({ name: 'logger' })
  .onBeforeHandle(({ request, set }) => {
    set.headers['X-Request-ID'] = crypto.randomUUID()
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`)
  })
  .onAfterHandle(({ request, set }) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - ${set.status}`)
  })
