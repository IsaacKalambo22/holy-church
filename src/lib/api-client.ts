// Client-side fetch for the same-origin API. The session lives in an HttpOnly
// cookie, so the browser attaches it automatically on same-origin requests —
// no Authorization header is needed (and the token is intentionally unreadable
// from JS). `credentials: 'same-origin'` is the default but is set explicitly
// to make the auth mechanism obvious.
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { credentials: 'same-origin', ...init })
}

// Clears the HttpOnly session cookie via the server (JS cannot clear it itself).
export async function logoutRequest(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' })
  } catch {
    // Ignore network errors — the client-side session state is cleared regardless.
  }
}
