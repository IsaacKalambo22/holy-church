'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const events = [
  { title: 'Annual Church Convention', date: 'Jul 4–6, 2026', time: '9:00 AM', location: 'Main Sanctuary', category: 'Convention', featured: true },
  { title: 'Youth Worship Night', date: 'Jun 27, 2026', time: '7:00 PM', location: 'Youth Center', category: 'Youth', featured: false },
  { title: 'Community Outreach Day', date: 'Jun 22, 2026', time: '8:00 AM', location: 'Area 18, Lilongwe', category: 'Outreach', featured: false },
  { title: 'Marriage Enrichment Seminar', date: 'Jul 12, 2026', time: '10:00 AM', location: 'Fellowship Hall', category: 'Family', featured: false },
]

const categoryColor: Record<string, string> = {
  Convention: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Youth: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Outreach: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Family: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export function EventsSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">What's Happening</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-2">Upcoming Events</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/events">
              See All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`group hover:shadow-md transition-all hover:-translate-y-0.5 ${event.featured ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}>
                <CardContent className="p-6 flex gap-5">
                  {/* Date block */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl gradient-brand flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-medium opacity-80">{event.date.split(' ')[0]}</span>
                    <span className="text-2xl font-bold leading-none">
                      {event.date.replace(/[^0-9–]/g, '').slice(0, 2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor[event.category] || ''}`}>
                        {event.category}
                      </span>
                      {event.featured && (
                        <Badge variant="brand" className="text-xs">Featured</Badge>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{event.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
