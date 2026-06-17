import { getSession } from '@/lib/auth-middleware'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Heart, BookOpen, User, Settings, LogOut, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData(userId: string) {
  const response = await fetch(`/api/member/dashboard`, {
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
    return null
  }

  const dashboardData = await getDashboardData(session.user.id)

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title={`Welcome, ${session.user.name}`}
        description="Manage your church membership and activities"
        badge="Member Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Giving Summary */}
        {dashboardData?.data?.givingSummary && (
          <Card className="mb-8 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Your Giving Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Given</p>
                  <p className="text-2xl font-bold text-foreground">
                    MWK {dashboardData.data.givingSummary.total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Donations</p>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardData.data.givingSummary.count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                My Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">View and manage your event registrations</p>
              {dashboardData?.data?.upcomingEvents && dashboardData.data.upcomingEvents.length > 0 && (
                <p className="text-xs text-muted-foreground mb-4">
                  {dashboardData.data.upcomingEvents.length} upcoming event{dashboardData.data.upcomingEvents.length !== 1 ? 's' : ''}
                </p>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/events">View Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Prayer Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Submit and track your prayer requests</p>
              {dashboardData?.data?.recentPrayerRequests && dashboardData.data.recentPrayerRequests.length > 0 && (
                <p className="text-xs text-muted-foreground mb-4">
                  {dashboardData.data.recentPrayerRequests.length} recent request{dashboardData.data.recentPrayerRequests.length !== 1 ? 's' : ''}
                </p>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/prayer">Manage Requests</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Giving History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">View your donation history and receipts</p>
              {dashboardData?.data?.recentDonations && dashboardData.data.recentDonations.length > 0 && (
                <p className="text-xs text-muted-foreground mb-4">
                  {dashboardData.data.recentDonations.length} recent donation{dashboardData.data.recentDonations.length !== 1 ? 's' : ''}
                </p>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/giving">View History</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-foreground">{session.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-foreground">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-foreground">{session.user.role}</p>
              </div>
              <div className="pt-4 flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" asChild>
                  <Link href="/auth/logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
