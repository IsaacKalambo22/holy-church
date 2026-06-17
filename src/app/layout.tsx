import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers/providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw'),
  title: {
    default: 'Holy Church Assembly',
    template: '%s | Holy Church Assembly',
  },
  description:
    'A place of worship, community, and spiritual growth. Join us for inspiring sermons, vibrant community, and life-changing experiences.',
  keywords: ['church', 'worship', 'sermons', 'community', 'faith', 'Malawi', 'prayer'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw',
    siteName: 'Holy Church Assembly',
    title: 'Holy Church Assembly',
    description: 'A place of worship, community, and spiritual growth.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holy Church Assembly',
    description: 'A place of worship, community, and spiritual growth.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geist.variable} font-sans flex flex-col min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
