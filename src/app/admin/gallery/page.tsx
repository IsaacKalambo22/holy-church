'use client'

import { ResourceManager, type Column, type Field } from '@/components/dashboard/ResourceManager'
import { fmtDate } from '@/components/dashboard/cells'

const columns: Column[] = [
  { key: 'caption', label: 'Caption' },
  {
    key: 'imageUrls',
    label: 'Images',
    render: (i) => `${Array.isArray(i.imageUrls) ? i.imageUrls.length : 0} image(s)`,
  },
  { key: 'createdAt', label: 'Added', render: (i) => fmtDate(i.createdAt) },
]

const fields: Field[] = [
  { name: 'caption', label: 'Caption', required: true },
  { name: 'imageUrls', label: 'Images', type: 'imagelist', required: true, help: 'Upload one or more photos' },
]

export default function AdminGalleryPage() {
  return (
    <ResourceManager
      endpoint="/api/gallery"
      title="Gallery Item"
      description="Manage photo galleries and media."
      columns={columns}
      fields={fields}
    />
  )
}
