import type { Metadata } from 'next'
import { Clock, MapPin, Car, Baby, Coffee, Users, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FAQSection } from '@/components/shared/FAQSection'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Plan Your Visit — Holy Church Assembly',
  description: 'Planning your first visit to Holy Church Assembly? Learn what to expect, service times, parking information, and answers to common questions.',
  keywords: ['visit', 'first time', 'what to expect', 'service times', 'parking', 'new visitor'],
  openGraph: {
    title: 'Plan Your Visit — Holy Church Assembly',
    description: 'Everything you need to know for your first visit.',
    type: 'website',
  },
}

const whatToExpect = [
  { icon: Coffee, title: 'Free Coffee', desc: 'Enjoy complimentary coffee and tea before the service.' },
  { icon: Users, title: 'Friendly People', desc: 'Our community is warm and welcoming. You\'ll feel right at home.' },
  { icon: Clock, title: '60-Minute Service', desc: 'Our services are about an hour long with engaging worship and teaching.' },
  { icon: CheckCircle, title: 'No Dress Code', desc: 'Come as you are. We care about you, not what you wear.' },
]

const serviceTimes = [
  { time: '9:00 AM', service: 'Sunday Celebration', description: 'Contemporary worship and practical teaching' },
  { time: '11:00 AM', service: 'Sunday Celebration', description: 'Same message, different time for your convenience' },
  { time: '6:30 PM', service: 'Wednesday Night', description: 'Midweek service for spiritual refreshment' },
  { time: '4:00 PM', service: 'Youth Service', description: 'Dynamic service for ages 13-25' },
]

const kidsInfo = [
  'Check-in opens 15 minutes before each service',
  'Safe, secure environment with trained volunteers',
  'Age-appropriate teaching and activities',
  'Bible stories, games, and crafts',
  'Parents receive a pager for emergencies',
]

const faqs = [
  { question: 'What should I wear?', answer: 'Come as you are! Some people dress up, others wear jeans. We want you to feel comfortable.' },
  { question: 'How long is the service?', answer: 'Our Sunday services are about 60 minutes. We start with worship, followed by a message from Scripture.' },
  { question: 'Is there parking available?', answer: 'Yes, we have ample free parking on-site. Our parking team will guide you to available spots.' },
  { question: 'What about my kids?', answer: 'We have excellent programs for children ages 3-12. Check them in at our Kids Wing before the service.' },
  { question: 'Will I be singled out as a visitor?', answer: 'No! We want you to feel welcome without feeling put on the spot. You can participate as much or as little as you like.' },
  { question: 'Do I need to bring anything?', answer: 'Just yourself! If you have a Bible, feel free to bring it, but we also have Bibles available for you to use.' },
]

export default function VisitPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Plan Your Visit</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Everything you need to know for your first Sunday</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* What To Expect */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">First Time?</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">What To Expect</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatToExpect.map((item) => (
              <Card key={item.title} className="text-center hover:shadow-md transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Service Times */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">When We Meet</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">Service Times</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {serviceTimes.map((service) => (
              <Card key={service.time} className="hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-heading text-primary">{service.time}</CardTitle>
                      <CardDescription className="text-base mt-1">{service.service}</CardDescription>
                    </div>
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Kids Ministry */}
        <section className="rounded-3xl gradient-hero p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Baby className="w-16 h-16 mb-6 text-[var(--brand-orange)]" />
              <h2 className="font-heading text-4xl font-bold mb-4">Kids Ministry</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                We have a safe, fun environment for your children ages 3-12. Our trained team will help your kids learn about God in age-appropriate ways.
              </p>
              <ul className="space-y-3">
                {kidsInfo.map((info, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--brand-orange)] flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="font-heading text-2xl font-bold mb-4">Check-In Process</h3>
              <ol className="space-y-4 text-white/90">
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">1</span>
                  <span>Visit the Kids Wing check-in desk</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">2</span>
                  <span>Fill out a quick registration form</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">3</span>
                  <span>Receive security tags for you and your child</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">4</span>
                  <span>Pick up your child after service with matching tag</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Parking */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Getting Here</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">Parking Information</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Car className="w-10 h-10 text-primary mb-3" />
                <CardTitle>On-Site Parking</CardTitle>
                <CardDescription>Free parking available for all visitors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">• Ample parking spaces available</p>
                <p className="text-muted-foreground text-sm">• Reserved spots for first-time guests</p>
                <p className="text-muted-foreground text-sm">• Accessible parking available near entrance</p>
                <p className="text-muted-foreground text-sm">• Parking team will guide you</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MapPin className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Location</CardTitle>
                <CardDescription>Area 18, Lilongwe, Malawi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">• Main sanctuary on ground floor</p>
                <p className="text-muted-foreground text-sm">• Kids Wing on first floor</p>
                <p className="text-muted-foreground text-sm">• Youth Center in annex building</p>
                <p className="text-muted-foreground text-sm">• Clear signage throughout campus</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Questions?</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQSection faqs={faqs} />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We would love to help you feel comfortable before your first visit. Reach out to us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="brand" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/services">View Service Times</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
