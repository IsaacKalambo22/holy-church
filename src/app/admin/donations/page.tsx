'use client'

import { ResourceManager, type Column, type Field } from '@/components/dashboard/ResourceManager'
import { fmtDate, Pill } from '@/components/dashboard/cells'

const statusTone: Record<string, 'green' | 'amber' | 'red' | 'gray'> = {
  COMPLETED: 'green',
  PENDING: 'amber',
  FAILED: 'red',
  REFUNDED: 'gray',
}

const columns: Column[] = [
  {
    key: 'amount',
    label: 'Amount',
    render: (i) => `${String(i.currency || 'MWK')} ${Number(i.amount || 0).toLocaleString()}`,
  },
  { key: 'category', label: 'Category' },
  { key: 'donorName', label: 'Donor', render: (i) => String(i.isAnonymous ? 'Anonymous' : i.donorName || '—') },
  {
    key: 'paymentStatus',
    label: 'Status',
    render: (i) => <Pill text={String(i.paymentStatus || 'PENDING')} tone={statusTone[String(i.paymentStatus)] || 'gray'} />,
  },
  { key: 'createdAt', label: 'Date', render: (i) => fmtDate(i.createdAt) },
]

const fields: Field[] = [
  { name: 'amount', label: 'Amount', type: 'number', required: true },
  { name: 'currency', label: 'Currency', placeholder: 'MWK' },
  { name: 'category', label: 'Category', placeholder: 'e.g. tithe, offering, building' },
  {
    name: 'paymentStatus',
    label: 'Payment Status',
    type: 'select',
    options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'FAILED', label: 'Failed' },
      { value: 'REFUNDED', label: 'Refunded' },
    ],
  },
  { name: 'donorName', label: 'Donor Name' },
  { name: 'donorEmail', label: 'Donor Email' },
  { name: 'message', label: 'Message', type: 'textarea' },
  { name: 'isAnonymous', label: 'Anonymous donation', type: 'checkbox' },
]

export default function AdminDonationsPage() {
  return (
    <ResourceManager
      endpoint="/api/donations"
      title="Donation"
      description="Record and manage donations."
      columns={columns}
      fields={fields}
    />
  )
}
