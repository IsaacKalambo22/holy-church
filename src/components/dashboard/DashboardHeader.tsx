'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, Sun, Moon, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { logoutRequest } from '@/lib/api-client'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
}

// Human-readable titles for known routes; falls back to the last path segment.
const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/activity': 'My Activity',
  '/dashboard/settings': 'Settings',
  '/admin': 'Overview',
  '/admin/overview': 'Overview',
  '/admin/members': 'Members',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/notifications': 'Notifications',
  '/admin/search': 'Search',
  '/admin/settings': 'Settings',
}

function titleFromPath(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname]
  const last = pathname.split('/').filter(Boolean).pop() || 'Dashboard'
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuthStore()
  const { toggleMobileMenu } = useUIStore()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleLogout = async () => {
    await logoutRequest()
    logout()
    window.location.href = '/'
  }

  const pageTitle = title || titleFromPath(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={toggleMobileMenu}
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">{pageTitle}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />
          ) : (
            <div className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 transition-colors hover:bg-accent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <span className="text-xs font-semibold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:inline">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:inline" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="p-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
