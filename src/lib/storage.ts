import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials are not set')
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
}

const BUCKET_NAME = process.env.BUCKET_NAME || 'holy-church'

export async function uploadToSupabase(
  key: string,
  file: File | Buffer,
  contentType: string
) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(key, file, {
      contentType,
      upsert: true,
    })

  if (error) {
    const hint = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? ''
      : ' Set SUPABASE_SERVICE_ROLE_KEY for server-side uploads if this is still failing.'
    throw new Error(`Upload failed: ${error.message}${hint}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key)

  return publicUrl
}

export async function deleteFromSupabase(key: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([key])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

export async function getPublicUrl(key: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key)

  return data.publicUrl
}
