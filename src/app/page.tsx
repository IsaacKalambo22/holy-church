import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { HeroSection } from '@/components/sections/HeroSection'
import { WelcomeSection } from '@/components/sections/WelcomeSection'
import { ServiceTimesSection } from '@/components/sections/ServiceTimesSection'
import { SermonsSection } from '@/components/sections/SermonsSection'
import { MinistriesSection } from '@/components/sections/MinistriesSection'
import { EventsSection } from '@/components/sections/EventsSection'
import { ChurchStatsSection } from '@/components/sections/ChurchStatsSection'
import { PrayerCTASection } from '@/components/sections/PrayerCTASection'
import { GallerySection } from '@/components/sections/GallerySection'
import { GivingSection } from '@/components/sections/GivingSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ContactSection } from '@/components/sections/ContactSection'

export const metadata: Metadata = {
  title: 'Holy Church Assembly — Where Every Soul Finds Home',
  description: 'A place of worship, grace, and spiritual transformation in Lilongwe, Malawi. Join us for Sunday services, sermons, and community.',
  keywords: ['church', 'worship', 'Malawi', 'Lilongwe', 'sermons', 'community', 'Christian'],
  openGraph: {
    title: 'Holy Church Assembly — Where Every Soul Finds Home',
    description: 'A place of worship, grace, and spiritual transformation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holy Church Assembly — Where Every Soul Finds Home',
    description: 'A place of worship, grace, and spiritual transformation.',
  },
}

async function fetchList(path: string) {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = headersList.get('x-forwarded-proto') || 'http'
    const res = await fetch(`${protocol}://${host}${path}`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = await res.json()
    return json.success && Array.isArray(json.data) ? json.data : []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [sermons, ministries, events, galleries] = await Promise.all([
    fetchList('/api/sermons?limit=3&published=true'),
    fetchList('/api/ministries?limit=6&status=ACTIVE'),
    fetchList('/api/events?limit=4'),
    fetchList('/api/gallery?limit=3'),
  ])

  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <ServiceTimesSection />
      <SermonsSection sermons={sermons} />
      <ChurchStatsSection />
      <MinistriesSection ministries={ministries} />
      <EventsSection events={events} />
      <PrayerCTASection />
      <GallerySection galleries={galleries} />
      <GivingSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
