'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Church,
  Calendar,
  BookOpen,
  Heart,
  FileText,
  GraduationCap,
  PlaySquare,
  Sparkles,
  Video,
  Image as ImageIcon,
  DollarSign,
  Bell,
  Search,
  ScrollText,
  Settings,
  Home,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { ADMIN_ROLES, CONTENT_ROLES, FINANCE_ROLES, type UserRole } from '@/lib/roles'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles?: UserRole[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
      { title: 'My Activity', href: '/dashboard/activity', icon: <ScrollText className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: 'My Learning',
    items: [
      { title: 'My Learning', href: '/dashboard/learning', icon: <GraduationCap className="w-[18px] h-[18px]" /> },
      { title: 'Browse Courses', href: '/lessons', icon: <PlaySquare className="w-[18px] h-[18px]" /> },
      { title: 'Sermons', href: '/sermons', icon: <Video className="w-[18px] h-[18px]" /> },
      { title: 'Prayer Wall', href: '/prayer/wall', icon: <Sparkles className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: 'Church Management',
    items: [
      { title: 'Members', href: '/admin/members', icon: <Users className="w-[18px] h-[18px]" />, roles: ADMIN_ROLES },
      { title: 'Ministries', href: '/admin/ministries', icon: <Church className="w-[18px] h-[18px]" />, roles: CONTENT_ROLES },
      { title: 'Events', href: '/admin/events', icon: <Calendar className="w-[18px] h-[18px]" />, roles: CONTENT_ROLES },
      { title: 'Sermons', href: '/admin/sermons', icon: <BookOpen className="w-[18px] h-[18px]" />, roles: CONTENT_ROLES },
      { title: 'Prayer Requests', href: '/admin/prayer', icon: <Heart className="w-[18px] h-[18px]" />, roles: CONTENT_ROLES },
    ],
  },
  {
    title: 'Content',
    items: [
      { title: 'Blog', href: '/admin/blog', icon: <FileText className="w-[18px] h-[18px]" />, roles: CONTENT_ROLES },
      { title: 'Gallery & Media', href: '/admin/gallery', icon: <ImageIcon className="w-[18px] h-[18px]" />, roles: CONTENT_ROLES },
    ],
  },
  {
    title: 'Learning',
    items: [
      { title: 'Courses', href: '/admin/courses', icon: <GraduationCap className="w-[18px] h-[18px]" />, roles: CONTENT_ROLES },
      { title: 'Lessons', href: '/admin/lessons', icon: <PlaySquare className="w-[18px] h-[18px]" />, roles: CONTENT_ROLES },
    ],
  },
  {
    title: 'Finance',
    items: [
      { title: 'Donations', href: '/admin/donations', icon: <DollarSign className="w-[18px] h-[18px]" />, roles: FINANCE_ROLES },
    ],
  },
  {
    title: 'Communication',
    items: [
      { title: 'Notifications', href: '/admin/notifications', icon: <Bell className="w-[18px] h-[18px]" />, roles: ADMIN_ROLES },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Search', href: '/admin/search', icon: <Search className="w-[18px] h-[18px]" />, roles: ADMIN_ROLES },
      { title: 'Audit Logs', href: '/admin/audit-logs', icon: <ScrollText className="w-[18px] h-[18px]" />, roles: ['SUPER_ADMIN'] },
      { title: 'Settings', href: '/admin/settings', icon: <Settings className="w-[18px] h-[18px]" />, roles: ADMIN_ROLES },
    ],
  },
]

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrator',
  PASTOR: 'Pastor',
  MINISTRY_LEADER: 'Ministry Leader',
  CONTENT_MANAGER: 'Content Manager',
  FINANCE_MANAGER: 'Finance Manager',
  MEMBER: 'Member',
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore()

  const userRole = (user?.role as UserRole) || 'MEMBER'

  const filteredNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(userRole)),
    }))
    .filter((section) => section.items.length > 0)

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Holy Church Assembly"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">Holy Church Assembly</p>
              <p className="text-[11px] text-muted-foreground">Management</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {filteredNavigation.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User + back to site */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-semibold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-muted-foreground">{roleLabels[userRole]}</p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Home className="w-[18px] h-[18px]" />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
