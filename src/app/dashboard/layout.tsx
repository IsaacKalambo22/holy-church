import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-middleware'
import { DashboardLayout as DashboardShell } from '@/components/dashboard/DashboardLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Any signed-in user gets a dashboard: members see a learning hub, staff see
  // the management console. Individual /admin pages enforce their own role guards.
  if (!session) {
    redirect('/auth/login')
  }

  return <DashboardShell>{children}</DashboardShell>
}
