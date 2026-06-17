import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth-middleware'
import { DashboardLayout as DashboardShell } from '@/components/dashboard/DashboardLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireRole(['SUPER_ADMIN', 'ADMIN'])
  } catch {
    redirect('/auth/login')
  }

  return (
    <DashboardShell title="Admin Dashboard" subtitle="Manage church administration">
      {children}
    </DashboardShell>
  )
}
