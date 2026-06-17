import { getSession } from '@/lib/auth-middleware'
import { FlameHero } from '@/components/shared/FlameHero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Heart, BookOpen, TrendingUp, FileText, Layers } from 'lucide-react'
import Link from 'next/link'

async function getAdminOverview() {
  const session = await getSession()
  if (!session) return null

  const response = await fetch(`/api/admin/overview`, {
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
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Admin Overview"
        description="Church administration dashboard and metrics"
        badge="Administrator"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metricCards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  )
}
