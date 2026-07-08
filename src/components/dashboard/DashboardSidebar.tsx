'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Church, 
  Calendar, 
  BookOpen, 
  Heart, 
  FileText, 
  Image, 
  DollarSign, 
  Bell, 
  Search, 
  FileText as FileAudit,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'
import { ADMIN_ROLES, CONTENT_ROLES, FINANCE_ROLES } from '@/lib/roles'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles?: string[]
  children?: NavItem[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    title: 'CHURCH MANAGEMENT',
    items: [
      { title: 'Members', href: '/admin/members', icon: <Users className="w-4 h-4" />, roles: ADMIN_ROLES },
      { title: 'Ministries', href: '/admin/ministries', icon: <Church className="w-4 h-4" />, roles: CONTENT_ROLES },
      { title: 'Events', href: '/admin/events', icon: <Calendar className="w-4 h-4" />, roles: CONTENT_ROLES },
      { title: 'Sermons', href: '/admin/sermons', icon: <BookOpen className="w-4 h-4" />, roles: CONTENT_ROLES },
      { title: 'Prayer Requests', href: '/admin/prayer', icon: <Heart className="w-4 h-4" />, roles: CONTENT_ROLES },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { title: 'Blog', href: '/admin/blog', icon: <FileText className="w-4 h-4" />, roles: CONTENT_ROLES },
      { title: 'Gallery & Media', href: '/admin/gallery', icon: <Image className="w-4 h-4" />, roles: CONTENT_ROLES },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { title: 'Donations', href: '/admin/donations', icon: <DollarSign className="w-4 h-4" />, roles: FINANCE_ROLES },
      { title: 'Financial Reports', href: '/admin/reports', icon: <FileText className="w-4 h-4" />, roles: FINANCE_ROLES },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { title: 'Notifications', href: '/admin/notifications', icon: <Bell className="w-4 h-4" />, roles: ADMIN_ROLES },
      { title: 'Broadcasts', href: '/admin/broadcasts', icon: <Bell className="w-4 h-4" />, roles: ADMIN_ROLES },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { title: 'Search', href: '/admin/search', icon: <Search className="w-4 h-4" />, roles: ADMIN_ROLES },
      { title: 'Audit Logs', href: '/admin/audit-logs', icon: <FileAudit className="w-4 h-4" />, roles: ['SUPER_ADMIN'] },
      { title: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" />, roles: ADMIN_ROLES },
    ],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuthStore()

  const userRole = user?.role || 'MEMBER'

  const hasAccess = (roles?: string[]) => {
    if (!roles) return true
    return roles.includes(userRole)
  }

  const filteredNavigation = navigation.map(section => ({
    ...section,
    items: section.items.filter(item => hasAccess(item.roles))
  })).filter(section => section.items.length > 0)

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-background border-r border-border transition-all duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">HC</span>
              </div>
              <span className="font-bold text-sm">Holy Church</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {filteredNavigation.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                        collapsed && 'justify-center'
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      {item.icon}
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{userRole}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
