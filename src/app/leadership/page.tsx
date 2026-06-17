import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Leadership — Holy Church Assembly',
  description: 'Meet the leadership team at Holy Church Assembly. Our pastors and leaders are committed to serving with humility, integrity, and love.',
  keywords: ['leadership', 'pastors', 'team', 'church leaders', 'Malawi'],
  openGraph: {
    title: 'Leadership — Holy Church Assembly',
    description: 'Meet the team serving our church.',
    type: 'website',
  },
}

const leadership = [
  {
    name: 'Pastor John Banda',
    role: 'Senior Pastor',
    bio: 'Pastor John founded Holy Church Assembly in 2010 with a vision to build a church where broken people encounter a whole God. His passion is to see lives transformed through the power of the gospel.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
  {
    name: 'Reverend Mary Phiri',
    role: 'Associate Pastor',
    bio: 'Rev. Mary oversees our discipleship programs and women\'s ministry. She has a heart for mentoring the next generation of leaders and helping believers grow deep in their faith.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    name: 'Pastor James Kondowe',
    role: 'Worship Pastor',
    bio: 'Pastor James leads our worship ministry with passion and excellence. He believes that worship is not just music but a lifestyle of surrender to God.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    name: 'Pastor Esther Banda',
    role: 'Youth Pastor',
    bio: 'Pastor Esther leads our youth ministry with energy and authenticity. She is committed to helping young people discover their identity in Christ.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  },
]

export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Our Leadership</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Meet the team serving our church</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Vision */}
        <section className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Approach</span>
          <h2 className="font-heading text-4xl font-bold text-foreground mt-3 mb-6">Servant Leadership</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            At Holy Church Assembly, we believe leadership is not about position but about service. Our leaders are
            committed to shepherding with humility, integrity, and a genuine love for God\'s people.
          </p>
        </section>

        {/* Leadership Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadership.map((person) => (
              <Card key={person.name} className="overflow-hidden hover:shadow-md transition-all">
                <div className="aspect-square bg-muted">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-heading font-bold text-foreground text-xl mb-1">{person.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{person.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{person.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Join Our Team</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We believe every member has a role to play. Discover how you can serve.
          </p>
          <Button variant="brand" size="lg" asChild>
            <Link href="/ministries">Explore Ministries</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
