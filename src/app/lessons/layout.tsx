import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-middleware'

// Lessons are free but require an account: any signed-in user (including plain
// MEMBERs) may view every course. Unauthenticated visitors are sent to login
// with a redirect back to where they were headed.
export default async function LessonsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect('/auth/login?redirect=/lessons')
  }
  return <>{children}</>
}
