import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

// The session JWT lives in an HttpOnly cookie and is never exposed to JS, so the
// store only holds the (non-sensitive) user profile for display. Same-origin API
// calls authenticate via the cookie automatically. Auth truth is the cookie; the
// persisted `user` is a UI convenience and may be stale until the next API call.
interface AuthState {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'holy-church-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
