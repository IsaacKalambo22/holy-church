'use client'

import { ResourceManager, type Column, type Field } from '@/components/dashboard/ResourceManager'
import { publishedPill } from '@/components/dashboard/cells'
import { LESSON_CATEGORIES } from '@/lib/lesson-categories'

const columns: Column[] = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Track' },
  { key: 'lessonCount', label: 'Lessons' },
  { key: 'published', label: 'Status', render: publishedPill },
]

const fields: Field[] = [
  { name: 'title', label: 'Title', required: true },
  { name: 'slug', label: 'Slug', required: true, help: 'URL-friendly identifier, e.g. foundations-for-ministers' },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'category',
    label: 'Track / Level',
    type: 'select',
    options: LESSON_CATEGORIES.map((c) => ({ value: c, label: c })),
    help: 'Who this course is for. Shown as a filter on the public lessons page.',
  },
  { name: 'imageUrl', label: 'Cover Image', type: 'image' },
  { name: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminCoursesPage() {
  return (
    <ResourceManager
      endpoint="/api/courses"
      listParams={{ admin: '1' }}
      title="Course"
      description="Group lessons into learning tracks. Add the lessons themselves under Lessons."
      columns={columns}
      fields={fields}
    />
  )
}
