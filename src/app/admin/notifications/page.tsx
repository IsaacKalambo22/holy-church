'use client'

import { useState, useEffect } from 'react'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Send, FileText } from 'lucide-react'
import Link from 'next/link'

export default function AdminNotificationsPage() {
  const [stats, setStats] = useState({
    total: 0,
    sentToday: 0,
    unread: 0,
  })

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch(`/api/notifications`)
        if (response.ok) {
          const result = await response.json()
          setStats({
            total: result.total || 0,
            sentToday: 0,
            unread: result.unreadCount || 0,
          })
        }
      } catch {
        console.error('Failed to load stats')
      }
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Notification Center"
        description="Manage church communications and broadcasts"
        badge="Administrator"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Sent Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.sentToday}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.unread}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Send Broadcast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Send a message to the entire church or specific groups</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/notifications/broadcast">Create Broadcast</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Manage Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Create and manage notification templates</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/notifications/templates">View Templates</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
