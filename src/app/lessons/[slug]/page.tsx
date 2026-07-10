import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CourseView, type CourseLesson } from '@/components/lessons/CourseView'
import { ViewTracker } from '@/components/shared/ViewTracker'

interface Course {
  id: string
  slug: string
  title: string
  description?: string | null
  category?: string | null
  views?: number
  lessons: CourseLesson[]
}

async function getCourse(slug: string): Promise<Course | null> {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'

  const res = await fetch(`${protocol}://${host}/api/courses/slug/${slug}`, { cache: 'no-store' })
  if (!res.ok) return null
  const json = await res.json()
  return json.success ? (json.data as Course) : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) return { title: 'Course not found' }
  return {
    title: course.title,
    description: course.description || `A free video course${course.category ? ` for ${course.category}` : ''}.`,
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) notFound()

  return (
    <div className="min-h-screen bg-background">
      <ViewTracker endpoint={`/api/courses/${course.id}/views`} dedupeKey={`course-${course.id}`} />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> All courses
        </Link>

        <div className="mb-8">
          {course.category && (
            <Badge className="bg-brand-orange border-0 text-white mb-3">{course.category}</Badge>
          )}
          <h1 className="font-heading text-4xl font-bold text-foreground">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground text-lg mt-3 max-w-3xl">{course.description}</p>
          )}
          {typeof course.views === 'number' && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" /> {course.views.toLocaleString()} {course.views === 1 ? 'view' : 'views'}
            </p>
          )}
        </div>

        <CourseView lessons={course.lessons} />
      </div>
    </div>
  )
}
