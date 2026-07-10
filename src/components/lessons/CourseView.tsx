'use client'

import { useState } from 'react'
import { PlayCircle, CheckCircle2, Circle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getVideoEmbed } from '@/lib/video'

export interface CourseLesson {
  id: string
  title: string
  description?: string | null
  videoUrl?: string | null
}

// Playlist-style course viewer: a video pane on the left, a clickable lesson
// list on the right. Selecting a lesson swaps the player without a page load.
export function CourseView({ lessons }: { lessons: CourseLesson[] }) {
  const [activeId, setActiveId] = useState(lessons[0]?.id)
  const active = lessons.find((l) => l.id === activeId) || lessons[0]
  const embed = getVideoEmbed(active?.videoUrl)

  if (!active) {
    return (
      <div className="rounded-xl border border-border py-16 text-center text-muted-foreground">
        No lessons in this course yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card className="overflow-hidden">
          <div className="aspect-video bg-black flex items-center justify-center">
            {embed?.kind === 'iframe' ? (
              <iframe
                key={active.id}
                src={embed.src}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={active.title}
              />
            ) : embed?.kind === 'file' ? (
              <video key={active.id} src={embed.src} controls className="w-full h-full" />
            ) : (
              <div className="text-center text-white/50">
                <PlayCircle className="w-16 h-16 mx-auto mb-3" />
                <p>Video coming soon</p>
              </div>
            )}
          </div>
        </Card>

        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">{active.title}</h2>
          {active.description && (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line mt-3">{active.description}</p>
          )}
        </div>
      </div>

      {/* Lesson list */}
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
          {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
        </p>
        {lessons.map((lesson, i) => {
          const isActive = lesson.id === active.id
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveId(lesson.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors',
                isActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-accent'
              )}
            >
              {isActive ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">Lesson {i + 1}</span>
                <span className={cn('block text-sm font-medium', isActive ? 'text-primary' : 'text-foreground')}>
                  {lesson.title}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
