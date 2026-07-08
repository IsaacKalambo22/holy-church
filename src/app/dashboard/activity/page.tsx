'use client'

import { useState, useEffect } from 'react'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Heart, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api-client'

interface Activity {
  id: string
  type: 'prayer_request' | 'donation'
  title: string
  description: string
  date: string
  status: string
}

export default function ActivityPage() {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await apiFetch(`/api/member/activity`)
        if (response.ok) {
          const result = await response.json()
          setActivities(result.data || [])
        }
      } catch {
        console.error('Failed to load activities')
      } finally {
        setLoading(false)
      }
    }
    loadActivities()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prayer_request':
        return <Heart className="w-5 h-5 text-purple-600" />
      case 'donation':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      default:
        return <Calendar className="w-5 h-5 text-primary" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'ANSWERED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="My Activity"
        description="View your recent activity and engagement with the church"
        badge="Member Activity"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading activity...</p>
          </div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-2">No activity yet</p>
              <p className="text-sm text-muted-foreground">Your activity will appear here as you engage with the church.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{activity.title}</h3>
                        <Badge variant="outline" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
