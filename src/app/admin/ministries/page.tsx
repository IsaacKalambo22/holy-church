'use client'

import { ResourceManager, type Column, type Field } from '@/components/dashboard/ResourceManager'
import { Pill } from '@/components/dashboard/cells'
import { MINISTRY_CATEGORIES } from '@/lib/ministry-categories'

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'meetingSchedule', label: 'Meets' },
  {
    key: 'status',
    label: 'Status',
    render: (i) => <Pill text={String(i.status || 'ACTIVE')} tone={String(i.status) === 'INACTIVE' ? 'gray' : 'green'} />,
  },
]

const fields: Field[] = [
  { name: 'name', label: 'Name', required: true },
  { name: 'slug', label: 'Slug', required: true, help: 'URL-friendly identifier' },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: MINISTRY_CATEGORIES.map((c) => ({ value: c, label: c })),
  },
  { name: 'meetingSchedule', label: 'Meeting Schedule', placeholder: 'e.g. Sundays 2pm' },
  { name: 'contactEmail', label: 'Contact Email' },
  { name: 'contactPhone', label: 'Contact Phone' },
  { name: 'imageUrl', label: 'Image', type: 'image' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'ACTIVE', label: 'Active' },
      { value: 'INACTIVE', label: 'Inactive' },
    ],
  },
  { name: 'volunteerRequired', label: 'Volunteers needed', type: 'checkbox' },
]

export default function AdminMinistriesPage() {
  return (
    <ResourceManager
      endpoint="/api/ministries"
      title="Ministry"
      description="Manage church ministries and groups."
      columns={columns}
      fields={fields}
    />
  )
}
