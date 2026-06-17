import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth-middleware'

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

  return <>{children}</>
}
