import { getSession } from '@/lib/auth-middleware'
import { headers } from 'next/headers'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Heart, BookOpen, User, Settings, LogOut, TrendingUp } from 'lucide-react'
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to access your dashboard</p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const dashboardData = await getDashboardData(session.user.id)
  const data = dashboardData?.data

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title={`Welcome, ${session.user.name || 'Member'}`}
        description="Manage your church membership and activities"
        badge="Member Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Given</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                MWK {data?.givingSummary?.total?.toLocaleString() || '0'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {data?.givingSummary?.count || '0'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {data?.upcomingEvents?.length || '0'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Prayer Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {data?.recentPrayerRequests?.length || '0'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                My Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">View and manage your event registrations</p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/events">Browse Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Prayer Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Submit and track your prayer requests</p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/prayer/wall">Prayer Wall</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Giving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Make a donation to support the church</p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/giving">Give Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                <p className="text-foreground font-medium">{session.user.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <p className="text-foreground font-medium">{session.user.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
                <p className="text-foreground font-medium">{session.user.role || 'MEMBER'}</p>
              </div>
            </div>
            <div className="pt-6 flex gap-3">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
