'use client'

import { ResourceManager, type Column, type Field } from '@/components/dashboard/ResourceManager'
import { fmtDate, Pill } from '@/components/dashboard/cells'

const statusTone: Record<string, 'green' | 'amber' | 'red' | 'gray'> = {
  PUBLISHED: 'green',
  DRAFT: 'gray',
  CANCELLED: 'red',
}

const columns: Column[] = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'date', label: 'Date', render: (i) => fmtDate(i.date) },
  { key: 'venue', label: 'Venue', render: (i) => String(i.venue || i.location || '—') },
  {
    key: 'status',
    label: 'Status',
    render: (i) => <Pill text={String(i.status || 'DRAFT')} tone={statusTone[String(i.status)] || 'gray'} />,
  },
]

const fields: Field[] = [
  { name: 'title', label: 'Title', required: true },
  { name: 'slug', label: 'Slug', required: true, help: 'URL-friendly identifier' },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date', type: 'date' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'excerpt', label: 'Excerpt' },
  { name: 'venue', label: 'Venue' },
  { name: 'location', label: 'Location' },
  { name: 'category', label: 'Category' },
  { name: 'capacity', label: 'Capacity', type: 'number' },
  { name: 'imageUrl', label: 'Image URL' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'PUBLISHED', label: 'Published' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
  },
  { name: 'registrationRequired', label: 'Registration required', type: 'checkbox' },
]

export default function AdminEventsPage() {
  return (
    <ResourceManager
      endpoint="/api/events"
      title="Event"
      description="Create and manage church events."
      columns={columns}
      fields={fields}
    />
  )
}
