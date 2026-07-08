import type { Metadata } from 'next'
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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <ServiceTimesSection />
      <SermonsSection />
      <ChurchStatsSection />
      <MinistriesSection />
      <EventsSection />
      <PrayerCTASection />
      <GallerySection />
      <GivingSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
