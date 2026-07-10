import Link from 'next/link'
import { BookOpen, PlayCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LearningCourse } from '@/lib/member-learning'

// Shared course card used across the member learning dashboard and hub.
// Mirrors the card styling on the public /lessons page.
export function CourseCard({ course }: { course: LearningCourse }) {
  return (
    <Link href={`/lessons/${course.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:border-primary/40 hover:shadow-md">
        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
          {course.imageUrl ? (
            <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
          ) : (
            <BookOpen className="h-10 w-10 text-white/80" />
          )}
        </div>
        <CardContent className="pt-4">
          {course.category && (
            <Badge className="mb-2 border-0 bg-brand-orange text-white">{course.category}</Badge>
          )}
          <h3 className="line-clamp-2 font-heading text-base font-bold text-foreground">{course.title}</h3>
          {course.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
          )}
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <PlayCircle className="h-4 w-4" />
            {course.lessonCount ?? 0} {course.lessonCount === 1 ? 'lesson' : 'lessons'}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
