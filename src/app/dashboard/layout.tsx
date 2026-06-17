import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth-middleware'
import { DashboardLayout as DashboardShell } from '@/components/dashboard/DashboardLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAuth()
  } catch {
    redirect('/auth/login')
  }

  return (
    <DashboardShell title="Dashboard" subtitle="Welcome to your member dashboard">
      {children}
    </DashboardShell>
  )
}
