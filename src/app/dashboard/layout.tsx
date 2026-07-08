import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-middleware'
import { isStaff } from '@/lib/roles'
import { DashboardLayout as DashboardShell } from '@/components/dashboard/DashboardLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Not signed in → login. Signed-in plain members have no dashboard yet, so
  // they are sent back to the public site (only staff manage things here).
  if (!session) {
    redirect('/auth/login')
  }
  if (!isStaff(session.user.role)) {
    redirect('/')
  }

  return (
    <DashboardShell title="Dashboard" subtitle="Manage your church">
      {children}
    </DashboardShell>
  )
}
