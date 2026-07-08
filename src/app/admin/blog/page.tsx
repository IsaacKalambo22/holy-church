'use client'

import { ResourceManager, type Column, type Field } from '@/components/dashboard/ResourceManager'
import { fmtDate, truncate, publishedPill } from '@/components/dashboard/cells'

const columns: Column[] = [
  { key: 'title', label: 'Title' },
  { key: 'excerpt', label: 'Excerpt', render: (i) => truncate(i.excerpt, 50) },
  { key: 'publishedAt', label: 'Published', render: (i) => fmtDate(i.publishedAt) },
  { key: 'published', label: 'Status', render: publishedPill },
]

const fields: Field[] = [
  { name: 'title', label: 'Title', required: true },
  { name: 'slug', label: 'Slug', help: 'Auto-generated from title if left blank' },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { name: 'content', label: 'Content', type: 'textarea' },
  { name: 'thumbnailUrl', label: 'Thumbnail', type: 'image' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'PUBLISHED', label: 'Published' },
    ],
  },
  { name: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminBlogPage() {
  return (
    <ResourceManager
      endpoint="/api/blog"
      title="Article"
      description="Write and manage blog articles."
      columns={columns}
      fields={fields}
    />
  )
}
