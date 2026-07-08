import { useAuthStore } from '@/store/auth-store'

/**
 * Client-side fetch wrapper that attaches the logged-in user's JWT as a Bearer
 * token. The API's auth guards read `Authorization: Bearer <token>`, so calls to
 * protected endpoints (member/admin/notifications) must go through this helper —
 * a bare `fetch` sends no credentials and is rejected with 401.
 */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = useAuthStore.getState().token
  const headers = new Headers(init.headers)
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return fetch(input, { ...init, headers })
}
