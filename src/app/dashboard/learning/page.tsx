import Link from 'next/link'
import { GraduationCap, BookOpen, ArrowUpRight } from 'lucide-react'
import { getSession } from '@/lib/auth-middleware'
import { getLearningData } from '@/lib/member-learning'
import { CourseCard } from '@/components/dashboard/CourseCard'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'My Learning',
}

export default async function LearningHubPage() {
  const session = await getSession()
  if (!session) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your learning.</p>
      </div>
    )
  }

  const data = await getLearningData(session.token)
  const track = data?.learningTrack ?? null
  const trackCourses = data?.trackCourses ?? []
  const otherCourses = data?.otherCourses ?? []
  const hasAny = trackCourses.length > 0 || otherCourses.length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">My Learning</h2>
          <p className="text-muted-foreground">
            {track
              ? <>Courses for your <span className="font-medium text-foreground">{track}</span> track, and more to explore.</>
              : 'Browse every course across all tracks.'}
          </p>
        </div>
        {track && (
          <Badge className="w-fit border-0 bg-primary/10 px-3 py-1.5 text-sm text-primary">
            <GraduationCap className="mr-1.5 h-4 w-4" /> {track}
          </Badge>
        )}
        {!track && (
          <Link href="/lessons" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Explore all tracks <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Track courses */}
      {trackCourses.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Your {track} track</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trackCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Everything else */}
      {otherCourses.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {trackCourses.length > 0 ? 'More courses to explore' : 'All courses'}
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {!hasAny && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <BookOpen className="h-7 w-7" />
          </div>
          <p className="text-lg font-medium text-foreground">No courses published yet</p>
          <p className="max-w-sm text-muted-foreground">New lessons are on the way — check back soon.</p>
        </div>
      )}
    </div>
  )
}
