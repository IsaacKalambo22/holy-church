'use client'

import { ResourceManager, type Column, type Field } from '@/components/dashboard/ResourceManager'
import { fmtDate, truncate, Pill } from '@/components/dashboard/cells'

const statusTone: Record<string, 'green' | 'amber' | 'blue' | 'gray'> = {
  ANSWERED: 'green',
  PENDING: 'amber',
  IN_PROGRESS: 'blue',
}

const columns: Column[] = [
  { key: 'title', label: 'Title', render: (i) => String(i.title || 'Prayer Request') },
  { key: 'request', label: 'Request', render: (i) => truncate(i.request, 60) },
  { key: 'category', label: 'Category' },
  {
    key: 'status',
    label: 'Status',
    render: (i) => <Pill text={String(i.status || 'PENDING')} tone={statusTone[String(i.status)] || 'gray'} />,
  },
  { key: 'isPublic', label: 'Public', render: (i) => <Pill text={i.isPublic ? 'Public' : 'Private'} tone={i.isPublic ? 'green' : 'gray'} /> },
  { key: 'createdAt', label: 'Submitted', render: (i) => fmtDate(i.createdAt) },
]

const fields: Field[] = [
  { name: 'title', label: 'Title' },
  { name: 'request', label: 'Request', type: 'textarea', required: true, help: 'At least 10 characters' },
  { name: 'category', label: 'Category' },
  { name: 'isPublic', label: 'Show on public prayer wall', type: 'checkbox' },
  { name: 'isAnonymous', label: 'Anonymous', type: 'checkbox' },
]

export default function AdminPrayerPage() {
  return (
    <ResourceManager
      endpoint="/api/prayer"
      title="Prayer Request"
      description="Review and manage prayer requests."
      columns={columns}
      fields={fields}
    />
  )
}
