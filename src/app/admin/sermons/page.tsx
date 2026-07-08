'use client'

import { ResourceManager, type Column, type Field } from '@/components/dashboard/ResourceManager'
import { fmtDate, publishedPill } from '@/components/dashboard/cells'

const columns: Column[] = [
  { key: 'title', label: 'Title' },
  { key: 'series', label: 'Series' },
  { key: 'date', label: 'Date', render: (i) => fmtDate(i.date) },
  { key: 'views', label: 'Views' },
  { key: 'published', label: 'Status', render: publishedPill },
]

const fields: Field[] = [
  { name: 'title', label: 'Title', required: true },
  { name: 'slug', label: 'Slug', required: true, help: 'URL-friendly identifier, e.g. grace-and-truth' },
  { name: 'series', label: 'Series' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'thumbnailUrl', label: 'Thumbnail', type: 'image' },
  { name: 'videoUrl', label: 'Video', type: 'video' },
  { name: 'audioUrl', label: 'Audio', type: 'audio' },
  { name: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminSermonsPage() {
  return (
    <ResourceManager
      endpoint="/api/sermons"
      title="Sermon"
      description="Upload and manage sermon recordings."
      columns={columns}
      fields={fields}
    />
  )
}
