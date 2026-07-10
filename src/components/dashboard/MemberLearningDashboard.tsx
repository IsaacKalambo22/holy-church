import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  Video,
  Headphones,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Heart,
  Gift,
  PlayCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CourseCard } from './CourseCard'
import type { LearningData, LearningSermon, LearningPodcast } from '@/lib/member-learning'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function MemberLearningDashboard({
  firstName,
  data,
}: {
  firstName: string
  data: LearningData | null
}) {
  const track = data?.learningTrack ?? null
  const trackCourses = data?.trackCourses ?? []
  const otherCourses = data?.otherCourses ?? []
  const sermons = data?.latestSermons ?? []
  const podcasts = data?.latestPodcasts ?? []

  // "Continue learning" leads with the member's track; falls back to everything
  // else when they're just exploring or their track has no courses yet.
  const primaryCourses = trackCourses.length > 0 ? trackCourses : otherCourses

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, {firstName}</h2>
          <p className="text-muted-foreground">
            {track
              ? <>You&apos;re on the <span className="font-medium text-foreground">{track}</span> track. Here&apos;s what to learn next.</>
              : 'Explore courses, sermons and podcasts to grow in your faith.'}
          </p>
        </div>
        {track && (
          <Badge className="w-fit border-0 bg-primary/10 px-3 py-1.5 text-sm text-primary">
            <GraduationCap className="mr-1.5 h-4 w-4" /> {track}
          </Badge>
        )}
      </div>

      {/* Track banner / CTA to browse everything */}
      <Link
        href="/dashboard/learning"
        className="flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">My Learning</p>
            <p className="text-xs text-muted-foreground">
              {track ? `Your ${track} courses and everything else` : 'Browse all courses and tracks'}
            </p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
      </Link>

      {/* Continue learning */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {trackCourses.length > 0 ? 'Continue learning' : 'Courses for you'}
          </h3>
          <Link href="/dashboard/learning" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {primaryCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {primaryCourses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<BookOpen className="h-6 w-6" />} text="No courses published yet — check back soon." />
        )}
      </section>

      {/* Media feeds */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latest sermons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest Sermons</CardTitle>
            <Link href="/sermons" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              All sermons <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {sermons.length > 0 ? (
              <ul className="space-y-3">
                {sermons.map((s) => (
                  <SermonRow key={s.id} sermon={s} />
                ))}
              </ul>
            ) : (
              <EmptyState icon={<Video className="h-6 w-6" />} text="No sermons yet" />
            )}
          </CardContent>
        </Card>

        {/* Latest podcasts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Podcasts</CardTitle>
          </CardHeader>
          <CardContent>
            {podcasts.length > 0 ? (
              <ul className="space-y-3">
                {podcasts.map((p) => (
                  <PodcastRow key={p.id} podcast={p} />
                ))}
              </ul>
            ) : (
              <EmptyState icon={<Headphones className="h-6 w-6" />} text="No podcasts yet" />
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

function SermonRow({ sermon }: { sermon: LearningSermon }) {
  const href = sermon.slug ? `/sermons/${sermon.slug}` : '/sermons'
  return (
    <li>
      <Link href={href} className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {sermon.videoUrl ? <Video className="h-5 w-5" /> : <Headphones className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{sermon.title}</p>
          <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(sermon.date)}
            </span>
            {sermon.series && <span className="truncate">{sermon.series}</span>}
          </div>
        </div>
        <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  )
}

function PodcastRow({ podcast }: { podcast: LearningPodcast }) {
  const href = podcast.videoUrl || podcast.audioUrl
  const inner = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Headphones className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{podcast.title}</p>
        {podcast.description && (
          <p className="truncate text-sm text-muted-foreground">{podcast.description}</p>
        )}
      </div>
      {href && <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </>
  )
  return (
    <li>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
        >
          {inner}
        </a>
      ) : (
        <div className="flex items-start gap-3 rounded-lg border border-border p-3">{inner}</div>
      )}
    </li>
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

function QuickAction({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
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
