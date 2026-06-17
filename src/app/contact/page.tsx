import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = {
  title: 'Contact Us — Holy Church Assembly',
  description: 'Get in touch with Holy Church Assembly. We would love to hear from you. Visit us in Lilongwe or send us a message.',
  keywords: ['contact', 'phone', 'email', 'address', 'map', 'Lilongwe'],
  openGraph: {
    title: 'Contact Us — Holy Church Assembly',
    description: 'We would love to hear from you.',
    type: 'website',
  },
}

const info = [
  { icon: MapPin, label: 'Address', value: '123 Faith Avenue, Area 3, Lilongwe, Malawi' },
  { icon: Phone, label: 'Phone', value: '+265 999 000 000' },
  { icon: Mail, label: 'Email', value: 'hello@holychurch.mw' },
  { icon: Clock, label: 'Office Hours', value: 'Monday–Friday: 8:00 AM – 5:00 PM' },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Contact Us</h1>
        <p className="text-white/70 text-xl">We would love to hear from you</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                  <p className="text-foreground font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-border h-64 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-10 h-10 mx-auto mb-2 text-primary/40" />
                <p className="text-sm">Map coming soon</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>We respond to all messages within one business day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Name</Label><Input placeholder="Your name" /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="you@email.com" /></div>
              </div>
              <div className="space-y-1.5"><Label>Subject</Label><Input placeholder="How can we help?" /></div>
              <div className="space-y-1.5"><Label>Message</Label><Textarea rows={6} placeholder="Your message..." /></div>
              <Button variant="brand" size="lg" className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
