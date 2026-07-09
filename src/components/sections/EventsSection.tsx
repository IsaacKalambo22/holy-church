'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EventItem {
  id: string
  slug?: string | null
  title: string
  date: string
  endDate?: string | null
  venue?: string | null
  location?: string | null
  category?: string | null
}

function parts(date: string) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return { day: '', mon: '', full: '' }
  return {
    day: d.toLocaleDateString('en-GB', { day: '2-digit' }),
    mon: d.toLocaleDateString('en-GB', { month: 'short' }),
    full: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  }
}

export function EventsSection({ events = [] }: { events?: EventItem[] }) {
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
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">What&apos;s Happening</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-2">Upcoming Events</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/events">
              See All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {events.map((event, i) => {
              const p = parts(event.date)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={event.slug ? `/events/${event.slug}` : '/events'}>
                    <Card className="group hover:shadow-md transition-all hover:-translate-y-0.5">
                      <CardContent className="p-6 flex gap-5">
                        <div className="shrink-0 w-16 h-16 rounded-xl gradient-brand flex flex-col items-center justify-center text-white">
                          <span className="text-xs font-medium opacity-80">{p.mon}</span>
                          <span className="text-2xl font-bold leading-none">{p.day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {event.category && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {event.category}
                            </span>
                          )}
                          <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors truncate mt-1.5">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{p.full}</span>
                            {(event.venue || event.location) && (
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.venue || event.location}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CalendarDays className="h-7 w-7" />
            </div>
            <p className="max-w-sm text-muted-foreground">No upcoming events right now. Check back soon.</p>
          </div>
        )}
      </div>
    </section>
  )
}
