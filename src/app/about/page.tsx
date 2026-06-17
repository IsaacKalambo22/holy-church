import type { Metadata } from 'next'
import { Users, Heart, BookOpen, Globe, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = { title: 'About Us' }

const values = [
  { icon: BookOpen, title: 'Scripture-Centred', desc: 'Every decision, every sermon, every ministry is anchored in the authority and truth of God\'s Word.' },
  { icon: Heart, title: 'Radical Grace', desc: 'We extend the same grace God has shown us to every person who walks through our doors.' },
  { icon: Users, title: 'Genuine Community', desc: 'Faith was never meant to be lived alone. We are a family committed to one another.' },
  { icon: Globe, title: 'Kingdom Mission', desc: 'We exist to advance God\'s kingdom — in Malawi and beyond — through love, service, and the gospel.' },
  { icon: Target, title: 'Excellence', desc: 'We honour God by doing everything with excellence — from worship to administration.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">About Us</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Our story, our values, and our mission</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Story */}
        <section className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Story</span>
          <h2 className="font-heading text-4xl font-bold text-foreground mt-3 mb-6">15 Years of Faith & Growth</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed text-left">
            <p>
              Holy Church Assembly began in 2010 with a small group of believers meeting in a living room in Lilongwe,
              united by one conviction: that God had more for their city. What started as 20 people has grown into a
              thriving community of over 10,000 members across multiple campuses.
            </p>
            <p>
              Our founder and Senior Pastor planted this church with a vision to build a house where every broken person
              could encounter a whole God. That vision has never changed. Every service, every program, every initiative
              exists to fulfil that mandate.
            </p>
            <p>
              Today, Holy Church Assembly is one of the fastest-growing churches in Malawi, known for its Spirit-filled
              worship, Bible-based teaching, and genuine love for the community.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="rounded-3xl gradient-hero p-12 text-center text-white">
          <span className="text-[var(--brand-orange)] text-sm font-semibold uppercase tracking-widest">Our Mission</span>
          <h2 className="font-heading text-4xl font-bold mt-3 mb-5">Why We Exist</h2>
          <p className="text-2xl font-heading font-medium text-white/90 max-w-3xl mx-auto leading-relaxed italic">
            "To know God, make Him known, and serve our community with love, truth, and excellence."
          </p>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">What We Believe</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-3">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Come and See for Yourself</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            The best way to understand who we are is to experience it. Join us this Sunday.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="brand" size="lg" asChild><Link href="/services">Plan Your Visit</Link></Button>
            <Button variant="outline" size="lg" asChild><Link href="/contact">Get in Touch</Link></Button>
          </div>
        </section>
      </div>
    </div>
  )
}
