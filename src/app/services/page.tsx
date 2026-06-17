import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, Calendar, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Services' }

const services = [
  {
    title: 'Sunday Celebration',
    time: '9:00 AM & 11:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for powerful worship, inspiring teaching, and community.',
    icon: Calendar,
  },
  {
    title: 'Wednesday Night',
    time: '6:30 PM',
    location: 'Main Sanctuary',
    description: 'Midweek service for spiritual refreshment and deeper teaching.',
    icon: Clock,
  },
  {
    title: 'Youth Service',
    time: 'Sundays 4:00 PM',
    location: 'Youth Center',
    description: 'Dynamic service designed for young people ages 13-25.',
    icon: Users,
  },
  {
    title: 'Kids Church',
    time: 'Sundays 9:00 AM & 11:00 AM',
    location: 'Kids Wing',
    description: 'Fun, safe environment for children ages 3-12 to learn about God.',
    icon: Users,
  },
]

const locations = [
  {
    name: 'Main Campus',
    address: 'Area 18, Lilongwe',
    services: ['Sunday Celebration', 'Wednesday Night', 'Youth Service', 'Kids Church'],
  },
  {
    name: 'Blantyre Campus',
    address: 'Chichiri, Blantyre',
    services: ['Sunday Celebration 10:00 AM'],
  },
  {
    name: 'Mzuzu Campus',
    address: 'City Centre, Mzuzu',
    services: ['Sunday Celebration 10:00 AM'],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Our Services</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Join us this week</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Services */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Weekly Schedule</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">Service Times</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="hover:shadow-md transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-foreground text-lg mb-1">{service.title}</h3>
                      <p className="text-primary font-medium text-sm mb-2">{service.time}</p>
                      <p className="text-muted-foreground text-sm mb-2">{service.location}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Locations */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Find Us</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">Campus Locations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Card key={location.name} className="hover:shadow-md transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2 text-center">{location.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 text-center">{location.address}</p>
                  <div className="space-y-1">
                    {location.services.map((service) => (
                      <p key={service} className="text-sm text-muted-foreground text-center">{service}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* First Visit */}
        <section className="rounded-3xl gradient-hero p-12 text-center text-white">
          <h2 className="font-heading text-4xl font-bold mb-4">Planning Your First Visit?</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            We know visiting a new church can be intimidating. Here's what you can expect: friendly people,
            contemporary worship, practical teaching, and a safe environment for your kids.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Get Directions</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
