'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

// Routes that render their own full-screen chrome (sidebar + header) and must
// NOT show the public marketing navbar/footer.
const APP_PREFIXES = ['/dashboard', '/admin']

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAppRoute = APP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )

  if (isAppRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
