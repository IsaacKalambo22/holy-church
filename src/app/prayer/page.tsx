import type { Metadata } from 'next'
import { Heart, BookOpen, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PrayerRequestForm } from '@/components/shared/PrayerRequestForm'
import { FAQSection } from '@/components/shared/FAQSection'

export const metadata: Metadata = {
  title: 'Prayer — Holy Church Assembly',
  description: 'Submit a prayer request or join our prayer team at Holy Church Assembly. We believe in the power of prayer.',
  keywords: ['prayer', 'prayer request', 'intercession', 'spiritual support'],
  openGraph: {
    title: 'Prayer — Holy Church Assembly',
    description: 'We would love to pray with you.',
    type: 'website',
  },
}

const scriptures = [
  { reference: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
  { reference: 'Jeremiah 29:12', text: 'Then you will call on me and come and pray to me, and I will listen to you.' },
  { reference: '1 Thessalonians 5:16-18', text: 'Rejoice always, pray continually, give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.' },
]

const faqs = [
  { question: 'How do I submit a prayer request?', answer: 'You can submit a prayer request using the form on this page. Our prayer team will pray for you within 24 hours.' },
  { question: 'Is my prayer request confidential?', answer: 'Yes, all prayer requests are kept confidential and only shared with our trained prayer team.' },
  { question: 'Can I join the prayer team?', answer: 'Yes! We welcome anyone who feels called to intercession. Contact us to learn about our prayer team training.' },
  { question: 'When do you pray?', answer: 'Our prayer team meets every Friday night at 6:00 PM. We also have a dedicated prayer chain for urgent needs.' },
]

export default function PrayerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <Heart className="w-14 h-14 mx-auto mb-4 text-[var(--brand-orange)]" />
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Prayer</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">We would love to pray with you</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Prayer Request Form */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Submit a Request</span>
              <h2 className="font-heading text-4xl font-bold text-foreground mt-3 mb-6">Share Your Need</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Whether you are facing a challenge, celebrating a victory, or simply need someone to agree with you in prayer — we are here for you.
              </p>
              <PrayerRequestForm />
            </div>

            <div className="space-y-6">
              <Card className="gradient-hero text-white border-0">
                <CardContent className="p-8">
                  <Users className="w-10 h-10 mb-4 text-[var(--brand-orange)]" />
                  <h3 className="font-heading text-2xl font-bold mb-3">Join Our Prayer Team</h3>
                  <p className="text-white/80 leading-relaxed mb-6">
                    Become part of a community that intercedes for our church, our city, and our nation. Training provided.
                  </p>
                  <Button variant="secondary" size="lg" className="w-full">Learn More</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prayer Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Friday Night Prayer</p>
                      <p className="text-muted-foreground text-sm">Every Friday at 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Sunday Pre-Service Prayer</p>
                      <p className="text-muted-foreground text-sm">Sundays at 8:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Emergency Prayer Line</p>
                      <p className="text-muted-foreground text-sm">Available 24/7 for urgent needs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Scriptures */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">God's Word</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">Scriptures for Encouragement</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scriptures.map((scripture) => (
              <Card key={scripture.reference} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <BookOpen className="w-8 h-8 text-primary mb-4" />
                  <p className="font-heading font-semibold text-foreground mb-2">{scripture.reference}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">"{scripture.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Common Questions</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQSection faqs={faqs} />
          </div>
        </section>
      </div>
    </div>
  )
}
