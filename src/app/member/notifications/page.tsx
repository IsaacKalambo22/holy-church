'use client'

import { useState, useEffect } from 'react'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Bell, Check, CheckCheck, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  channel: string
  read: boolean
  createdAt: string
}

export default function MemberNotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    async function loadNotifications() {
      try {
        const params = new URLSearchParams()
        if (filter === 'unread') params.append('unreadOnly', 'true')

        const response = await fetch(`/api/notifications?${params}`)
        if (response.ok) {
          const result = await response.json()
          setNotifications(result.data || [])
          setUnreadCount(result.unreadCount || 0)
        }
      } catch {
        console.error('Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }
    loadNotifications()
  }, [filter])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch {
      console.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications/read-all`, { method: 'PATCH' })
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      console.error('Failed to mark all as read')
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications(notifications.filter((n) => n.id !== id))
      if (!notifications.find((n) => n.id === id)?.read) {
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
    } catch {
      console.error('Failed to delete notification')
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'EVENT':
        return 'bg-purple-100 text-purple-800'
      case 'SERMON':
        return 'bg-blue-100 text-blue-800'
      case 'PRAYER':
        return 'bg-pink-100 text-pink-800'
      case 'DONATION':
        return 'bg-green-100 text-green-800'
      case 'BLOG':
        return 'bg-orange-100 text-orange-800'
      case 'ANNOUNCEMENT':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Notifications"
        description="Stay updated with church activities and announcements"
        badge="Member Portal"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount} unread</Badge>
                )}
              </CardTitle>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
                  className="h-9 px-3 border border-input rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                </select>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-20">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border border-border rounded-lg hover:bg-accent transition-all ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <Badge variant="outline" className={getTypeBadgeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
