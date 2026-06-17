import { getSession } from '@/lib/auth-middleware'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Heart, Settings, BarChart3, LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Admin Dashboard"
        description="Manage church administration and content"
        badge="Administrator"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Manage users, roles, and permissions</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Sermon Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Upload and manage sermon content</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/sermons">Manage Sermons</Link>
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
              <p className="text-muted-foreground text-sm mb-4">Review and manage prayer requests</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/prayer">Manage Requests</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">View church statistics and analytics</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Site Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Configure site-wide settings</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/settings">Edit Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
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
              <div className="pt-4">
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
