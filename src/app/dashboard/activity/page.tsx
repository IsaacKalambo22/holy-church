'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Heart, TrendingUp } from 'lucide-react'
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
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Your recent activity and engagement with the church.
      </p>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="mb-1 font-medium text-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground">
              Your activity will appear here as you engage with the church.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="transition-shadow hover:shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h3 className="truncate font-semibold text-foreground">{activity.title}</h3>
                      <Badge variant="outline" className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="mb-1 text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString('en-GB', {
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
  )
}
