import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth-middleware'

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

  return <>{children}</>
}
