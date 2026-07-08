import { Elysia, t } from 'elysia'
import { randomUUID } from 'crypto'
import { uploadToSupabase } from '@/lib/storage'
import { contentGuard } from '../middleware/rbac'

// File upload endpoint — accepts multipart/form-data with a single `file`,
// stores it in Supabase Storage, and returns its public URL. Restricted to
// content-managing staff (contentGuard). Used by the admin resource forms.
export const uploadRoutes = new Elysia({ prefix: '/upload' })
  .use(contentGuard)
  .post(
    '/',
    async ({ body, set }) => {
      const file = body.file
      if (!file) {
        set.status = 400
        return { success: false, error: 'No file provided' }
      }

      const ext = file.name?.includes('.') ? file.name.split('.').pop() : undefined
      const folder = file.type?.startsWith('video')
        ? 'videos'
        : file.type?.startsWith('audio')
          ? 'audio'
          : 'images'
      const key = `${folder}/${Date.now()}-${randomUUID()}${ext ? '.' + ext : ''}`

      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const url = await uploadToSupabase(key, buffer, file.type || 'application/octet-stream')
        return { success: true, data: { url } }
      } catch (err) {
        set.status = 500
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Upload failed',
        }
      }
    },
    {
      body: t.Object({
        file: t.File({ maxSize: '100m' }),
      }),
    }
  )
