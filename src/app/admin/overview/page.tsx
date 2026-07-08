import { getSession } from '@/lib/auth-middleware'
import { headers } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Heart, BookOpen, TrendingUp, FileText, Layers } from 'lucide-react'
import Link from 'next/link'

async function getAdminOverview() {
  const session = await getSession()
  if (!session) return null

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`

  const response = await fetch(`${baseUrl}/api/admin/overview`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  })

  if (!response.ok) return null
  return response.json()
}

export default async function AdminOverviewPage() {
  const overviewData = await getAdminOverview()

  const metrics = overviewData?.data?.metrics || {}
  const recentActivity = overviewData?.data?.recentActivity || []

  const metricCards = [
    { title: 'Total Members', value: metrics.members?.total || 0, subtitle: `${metrics.members?.active || 0} active`, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Events', value: metrics.events?.total || 0, subtitle: `${metrics.events?.upcoming || 0} upcoming`, icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Prayer Requests', value: metrics.prayers?.total || 0, subtitle: `${metrics.prayers?.pending || 0} pending`, icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-100' },
    { title: 'Donations', value: metrics.donations?.total || 0, subtitle: `MWK ${(metrics.donations?.amount || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Sermons', value: metrics.sermons?.total || 0, subtitle: `${metrics.sermons?.published || 0} published`, icon: BookOpen, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { title: 'Blog Posts', value: metrics.blogs?.total || 0, subtitle: `${metrics.blogs?.published || 0} published`, icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { title: 'Ministries', value: metrics.ministries?.total || 0, subtitle: `${metrics.ministries?.active || 0} active`, icon: Layers, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  ]

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Church administration metrics and recent activity.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bgColor} dark:bg-primary/10`}>
                  <card.icon className={`h-5 w-5 ${card.color} dark:text-primary`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/sermons">
                  <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent transition-all">
                    <BookOpen className="w-5 h-5 mb-2 text-primary" />
                    <p className="text-sm font-medium">Create Sermon</p>
                  </button>
                </Link>
                <Link href="/admin/events">
                  <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent transition-all">
                    <Calendar className="w-5 h-5 mb-2 text-primary" />
                    <p className="text-sm font-medium">Create Event</p>
                  </button>
                </Link>
                <Link href="/admin/ministries">
                  <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent transition-all">
                    <Layers className="w-5 h-5 mb-2 text-primary" />
                    <p className="text-sm font-medium">Create Ministry</p>
                  </button>
                </Link>
                <Link href="/admin/blog">
                  <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent transition-all">
                    <FileText className="w-5 h-5 mb-2 text-primary" />
                    <p className="text-sm font-medium">Publish Article</p>
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((log: { id: string; action: string; actor?: { name: string }; createdAt: string }) => (
                    <div key={log.id} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{log.action}</p>
                        <p className="text-muted-foreground truncate">{log.actor?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </p>
                      </div>
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
