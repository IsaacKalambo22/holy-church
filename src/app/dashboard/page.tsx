import Link from 'next/link'
import { headers } from 'next/headers'
import { getSession } from '@/lib/auth-middleware'
import { isAdmin } from '@/lib/roles'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  Heart,
  DollarSign,
  Gift,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CalendarDays,
} from 'lucide-react'

interface DashboardData {
  user: { id: string; name: string; email: string; role: string }
  upcomingEvents: Array<{ id: string; title: string; date: string; location?: string | null; venue?: string | null }>
  recentPrayerRequests: Array<{ id: string; title?: string | null; request: string; status: string; createdAt: string }>
  recentDonations: Array<{ id: string; amount: number; category: string; paymentStatus: string; createdAt: string }>
  givingSummary: { total: number; count: number }
}

async function getDashboardData(token: string): Promise<DashboardData | null> {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`

  try {
    const response = await fetch(`${baseUrl}/api/member/dashboard`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return null
    const json = await response.json()
    return json.success ? (json.data as DashboardData) : null
  } catch {
    return null
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  ANSWERED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  COMPLETED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string
  hint: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Please sign in to access your dashboard</p>
      </div>
    )
  }

  const data = await getDashboardData(session.token)
  const firstName = session.user.name?.split(' ')[0] || 'there'
  const admin = isAdmin(session.user.role)

  const totalGiven = data?.givingSummary?.total ?? 0
  const givingCount = data?.givingSummary?.count ?? 0
  const upcomingEvents = data?.upcomingEvents ?? []
  const prayerRequests = data?.recentPrayerRequests ?? []

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, {firstName}</h2>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your church community.</p>
        </div>
        <Link
          href="/giving"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Gift className="h-4 w-4" />
          Give Now
        </Link>
      </div>

      {/* Admin console banner */}
      {admin && (
        <Link
          href="/admin"
          className="flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Admin Console</p>
              <p className="text-xs text-muted-foreground">Manage members, content, finances and more.</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Given"
          value={`MWK ${totalGiven.toLocaleString()}`}
          hint={`${givingCount} donation${givingCount === 1 ? '' : 's'}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Upcoming Events"
          value={String(upcomingEvents.length)}
          hint="In the coming weeks"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          label="Prayer Requests"
          value={String(prayerRequests.length)}
          hint="Recently submitted"
          icon={<Heart className="h-5 w-5" />}
        />
        <StatCard
          label="Donations"
          value={String(givingCount)}
          hint="Lifetime contributions"
          icon={<Gift className="h-5 w-5" />}
        />
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Events</CardTitle>
            <Link href="/events" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-3">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{event.title}</p>
                      <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(event.date)}
                        </span>
                        {(event.venue || event.location) && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {event.venue || event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={<Calendar className="h-6 w-6" />} text="No upcoming events" />
            )}
          </CardContent>
        </Card>

        {/* Recent prayer requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Prayer Requests</CardTitle>
            <Link href="/prayer/wall" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Prayer wall <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {prayerRequests.length > 0 ? (
              <ul className="space-y-3">
                {prayerRequests.map((pr) => (
                  <li key={pr.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{pr.title || 'Prayer Request'}</p>
                      <p className="truncate text-sm text-muted-foreground">{pr.request}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        statusStyles[pr.status] || 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {pr.status.toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={<Heart className="h-6 w-6" />} text="No prayer requests yet" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickAction href="/events" icon={<Calendar className="h-5 w-5" />} title="Browse Events" desc="Register for upcoming events" />
          <QuickAction href="/prayer/wall" icon={<Heart className="h-5 w-5" />} title="Prayer Wall" desc="Submit and track prayer requests" />
          <QuickAction href="/giving" icon={<Gift className="h-5 w-5" />} title="Make a Donation" desc="Support the church's mission" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

function QuickAction({
  href,
  icon,
  title,
  desc,
}: {
  href: string
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all hover:border-primary/40 hover:shadow-sm">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="flex items-center gap-1 font-medium text-foreground">
              {title}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </p>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
