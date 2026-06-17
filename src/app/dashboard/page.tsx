import { getSession } from '@/lib/auth-middleware'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Heart, BookOpen, User, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title={`Welcome, ${session.user.name}`}
        description="Manage your church membership and activities"
        badge="Member Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
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
