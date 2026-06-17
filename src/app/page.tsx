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
