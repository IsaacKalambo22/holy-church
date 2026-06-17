import { getSession } from '@/lib/auth-middleware'
import { headers } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Heart, BookOpen, User, TrendingUp, Users, DollarSign, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData(userId: string) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/member/dashboard`, {
    cache: 'no-store',
    headers: {
      Cookie: `session=${userId}`,
    },
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please sign in to access your dashboard</p>
      </div>
    )
  }

  const dashboardData = await getDashboardData(session.user.id)
  const data = dashboardData?.data

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back, {session.user.name?.split(' ')[0] || 'Member'}
        </h2>
        <p className="text-muted-foreground">Here's what's happening with your church membership</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Given</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              MWK {data?.givingSummary?.total?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.givingSummary?.count || 0} donations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.upcomingEvents?.length || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Upcoming events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prayer Requests</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.recentPrayerRequests?.length || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recent requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sermons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              12
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available sermons
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/events" className="group">
            <Card className="hover:shadow-md transition-all cursor-pointer group-hover:border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-5 h-5 text-primary" />
                  Browse Events
                  <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and register for upcoming church events
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/prayer/wall" className="group">
            <Card className="hover:shadow-md transition-all cursor-pointer group-hover:border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="w-5 h-5 text-primary" />
                  Prayer Wall
                  <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submit and track your prayer requests
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/giving" className="group">
            <Card className="hover:shadow-md transition-all cursor-pointer group-hover:border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Make a Donation
                  <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Support the church with a donation
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <Card>
          <CardContent className="pt-6">
            {data?.recentPrayerRequests && data.recentPrayerRequests.length > 0 ? (
              <div className="space-y-4">
                {data.recentPrayerRequests.slice(0, 5).map((request: any) => (
                  <div key={request.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{request.title || 'Prayer Request'}</p>
                      <p className="text-sm text-muted-foreground truncate">{request.description || 'No description'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-1">Your activity will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

