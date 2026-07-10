'use client'

import { useEffect, useState } from 'react'
import { ResourceManager, type Column, type Field, type Item } from '@/components/dashboard/ResourceManager'
import { publishedPill } from '@/components/dashboard/cells'
import { apiFetch } from '@/lib/api-client'
import { Loader2 } from 'lucide-react'

const columns: Column[] = [
  { key: 'order', label: '#' },
  { key: 'title', label: 'Lesson' },
  {
    key: 'course',
    label: 'Course',
    render: (i: Item) => {
      const course = i.course as { title?: string } | null
      return course?.title || '—'
    },
  },
  { key: 'views', label: 'Views' },
  { key: 'published', label: 'Status', render: publishedPill },
]

export default function AdminLessonsPage() {
  const [courses, setCourses] = useState<{ id: string; title: string }[] | null>(null)

  useEffect(() => {
    apiFetch('/api/courses?admin=1&limit=200')
      .then((r) => r.json())
      .then((j) => setCourses(j.success ? j.data : []))
      .catch(() => setCourses([]))
  }, [])

  if (!courses) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading…
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Create a course first, then add lessons to it.
      </div>
    )
  }

  const fields: Field[] = [
    {
      name: 'courseId',
      label: 'Course',
      type: 'select',
      required: true,
      options: courses.map((c) => ({ value: c.id, label: c.title })),
    },
    { name: 'title', label: 'Lesson Title', required: true },
    { name: 'order', label: 'Order', type: 'number', help: 'Lessons are shown low-to-high within a course.' },
    { name: 'description', label: 'Description', type: 'textarea' },
    {
      name: 'videoUrl',
      label: 'Video',
      type: 'videourl',
      help: 'Paste a YouTube or Vimeo link. Upload the video there (free) and paste the share URL — we embed it, so it costs no storage.',
    },
    { name: 'published', label: 'Published', type: 'checkbox' },
  ]

  return (
    <ResourceManager
      endpoint="/api/lessons"
      title="Lesson"
      description="Individual video lessons that belong to a course."
      columns={columns}
      fields={fields}
    />
  )
}
