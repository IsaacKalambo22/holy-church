import type { Metadata } from 'next'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Events' }

const events = [
  { title: 'Annual Church Convention', date: 'Jul 4–6, 2026', time: '9:00 AM', location: 'Main Sanctuary', category: 'Convention', desc: 'Three days of powerful worship, teaching, and fellowship. This year\'s theme: "Rooted and Built Up in Him."' },
  { title: 'Youth Worship Night', date: 'Jun 27, 2026', time: '7:00 PM', location: 'Youth Center', category: 'Youth', desc: 'An electric night of worship, spoken word, and community designed for the next generation.' },
  { title: 'Community Outreach Day', date: 'Jun 22, 2026', time: '8:00 AM', location: 'Area 18, Lilongwe', category: 'Outreach', desc: 'Join us as we serve our city. Free food, medical checkups, and practical community care.' },
  { title: 'Marriage Enrichment Seminar', date: 'Jul 12, 2026', time: '10:00 AM', location: 'Fellowship Hall', category: 'Family', desc: 'A practical one-day seminar for couples at every stage of marriage. Registration required.' },
  { title: 'Prayer & Fasting Week', date: 'Jul 20–27, 2026', time: '6:00 AM', location: 'Prayer Room', category: 'Prayer', desc: 'Seven days of corporate prayer and fasting. Join us each morning as we seek the face of God.' },
  { title: "Children's Day Celebration", date: 'Aug 2, 2026', time: '9:00 AM', location: 'Main Sanctuary', category: 'Children', desc: 'A special day celebrating the children in our community with fun, games, gifts, and a kid-focused service.' },
]

const catColors: Record<string, string> = {
  Convention: 'bg-purple-100 text-purple-700',
  Youth: 'bg-blue-100 text-blue-700',
  Outreach: 'bg-orange-100 text-orange-700',
  Family: 'bg-rose-100 text-rose-700',
  Prayer: 'bg-indigo-100 text-indigo-700',
  Children: 'bg-yellow-100 text-yellow-700',
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl font-bold text-white mb-3">Events</h1>
          <p className="text-white/70 text-xl">Stay connected with what God is doing in our community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.title} className="hover:shadow-md hover:-translate-y-0.5 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg leading-snug">{event.title}</CardTitle>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${catColors[event.category]}`}>
                    {event.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm leading-relaxed">{event.desc}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" />{event.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{event.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" />{event.location}</span>
                </div>
                <Button size="sm" variant="outline" className="mt-1">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
