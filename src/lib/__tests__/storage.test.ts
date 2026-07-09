import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}))

import { uploadToSupabase } from '../storage'

describe('storage uploads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    process.env.BUCKET_NAME = 'holy-church'
  })

  it('prefers the service role key when available for uploads', async () => {
    createClientMock.mockReturnValue({
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ error: null }),
          getPublicUrl: vi.fn().mockReturnValue({
            data: { publicUrl: 'https://example.supabase.co/storage/v1/object/public/holy-church/test.jpg' },
          }),
        }),
      },
    })

    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'

    await uploadToSupabase('images/test.jpg', Buffer.from('test'), 'image/jpeg')

    expect(createClientMock).toHaveBeenCalledWith('https://example.supabase.co', 'service-role-key')
  })
})
