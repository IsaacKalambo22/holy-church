import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { BookOpen, PlayCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LESSON_CATEGORIES } from '@/lib/lesson-categories'

export const metadata: Metadata = {
  title: 'Lessons',
  description: 'Free video lessons and courses for every stage of your walk — from new believers to ministers.',
}

interface CourseSummary {
  id: string
  slug: string
  title: string
  description?: string | null
  category?: string | null
  imageUrl?: string | null
  lessonCount?: number
}

async function getCourses(category?: string): Promise<CourseSummary[]> {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const params = new URLSearchParams({ limit: '100' })
  if (category) params.set('category', category)

  const res = await fetch(`${protocol}://${host}/api/courses?${params.toString()}`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  const json = await res.json()
  return json.success ? (json.data as CourseSummary[]) : []
}

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category && LESSON_CATEGORIES.includes(category as never) ? category : undefined
  const courses = await getCourses(activeCategory)

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Lessons &amp; Courses</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">
          Grow in your faith with free video courses — for beginners, believers, and ministers alike.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Track filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <Link
            href="/lessons"
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              !activeCategory
                ? 'border-primary bg-primary text-white'
                : 'border-input text-muted-foreground hover:bg-accent'
            )}
          >
            All
          </Link>
          {LESSON_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/lessons?category=${encodeURIComponent(cat)}`}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                activeCategory === cat
                  ? 'border-primary bg-primary text-white'
                  : 'border-input text-muted-foreground hover:bg-accent'
              )}
            >
              {cat}
            </Link>
          ))}
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/lessons/${course.slug}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center relative">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
                    ) : (
                      <BookOpen className="w-12 h-12 text-white/80" />
                    )}
                  </div>
                  <CardContent className="pt-4">
                    {course.category && (
                      <Badge className="bg-brand-orange border-0 text-white mb-2">{course.category}</Badge>
                    )}
                    <h3 className="font-heading text-lg font-bold text-foreground line-clamp-2">{course.title}</h3>
                    {course.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <PlayCircle className="w-4 h-4" />
                      {course.lessonCount ?? 0} {course.lessonCount === 1 ? 'lesson' : 'lessons'}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <BookOpen className="h-7 w-7" />
            </div>
            <p className="text-lg font-medium text-foreground">No courses published yet</p>
            <p className="text-muted-foreground max-w-sm">
              {activeCategory
                ? 'No courses in this track yet. Check back soon or explore other tracks.'
                : 'New lessons are on the way — check back soon.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
