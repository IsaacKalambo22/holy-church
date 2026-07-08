import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-middleware'
import { isStaff } from '@/lib/roles'
import { DashboardLayout as DashboardShell } from '@/components/dashboard/DashboardLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // The /admin console is the shared workspace for all staff roles; the sidebar
  // shows each role only its relevant links and every admin API is role-guarded
  // (adminGuard / financeGuard / contentGuard), so a non-admin staffer who
  // navigates to an admin-only page just gets an empty, 403'd view — no data
  // leaks. Plain MEMBERs are excluded entirely.
  if (!session) {
    redirect('/auth/login')
  }
  if (!isStaff(session.user.role)) {
    redirect('/')
  }

  return <DashboardShell>{children}</DashboardShell>
}
