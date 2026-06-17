import type { Metadata } from 'next'
import { Calendar, MapPin, Clock, Users, Share2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EventRegistrationForm } from '@/components/shared/EventRegistrationForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getEvent(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/api/events/slug/${slug}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const result = await response.json()
  return result.data as {
    id: string
    title: string
    slug: string
    description?: string | null
    excerpt?: string | null
    date: string
    endDate?: string | null
    location?: string | null
    venue?: string | null
    imageUrl?: string | null
    category?: string | null
    capacity?: number | null
    status: string
    registrationRequired: boolean
    registrationDeadline?: string | null
  } | null
}

async function getRelatedEvents(category?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const params = new URLSearchParams()
  params.set('limit', '4')
  if (category) params.set('category', category)
  
  const response = await fetch(`${baseUrl}/api/events?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return []
  }

  const result = await response.json()
  return result.data.slice(0, 3)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEvent(params.slug)
  
  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }

  return {
    title: `${event.title} — Holy Church Assembly`,
    description: event.excerpt || event.description || `Join us for ${event.title} at Holy Church Assembly.`,
    openGraph: {
      title: event.title,
      description: event.excerpt || event.description || undefined,
      type: 'website',
      images: event.imageUrl ? [{ url: event.imageUrl }] : undefined,
    },
  }
}

export default async function EventDetailsPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)
  
  if (!event) {
    notFound()
  }

  const relatedEvents = await getRelatedEvents(event.category || undefined)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const isPast = new Date(event.date) < new Date()
  const isUpcoming = !isPast

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {event.imageUrl ? (
        <div className="relative h-64 md:h-80">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
            <div className="flex items-center gap-3 mb-3">
              {event.category && (
                <Badge className="bg-[var(--brand-orange)] border-0 text-white">{event.category}</Badge>
              )}
              <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                {isUpcoming ? 'Upcoming' : 'Past Event'}
              </Badge>
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      ) : (
        <div className="gradient-hero py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
            <div className="flex items-center gap-3 mb-3">
              {event.category && (
                <Badge className="bg-[var(--brand-orange)] border-0 text-white">{event.category}</Badge>
              )}
              <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                {isUpcoming ? 'Upcoming' : 'Past Event'}
              </Badge>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Date</p>
                      <p className="text-muted-foreground">{formatDate(event.date)}</p>
                      {event.endDate && (
                        <p className="text-muted-foreground text-sm">to {formatDate(event.endDate)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Time</p>
                      <p className="text-muted-foreground">{formatTime(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p className="text-muted-foreground">{event.venue || event.location || 'TBD'}</p>
                      {event.location && event.venue && event.location !== event.venue && (
                        <p className="text-muted-foreground text-sm">{event.location}</p>
                      )}
                    </div>
                  </div>
                  {event.capacity && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Capacity</p>
                        <p className="text-muted-foreground">{event.capacity} attendees</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {event.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">About This Event</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Registration CTA */}
            {event.registrationRequired && isUpcoming && (
              <EventRegistrationForm eventId={event.id} />
            )}

            {/* Share Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                  </Button>
                  <Button variant="outline" size="sm">
                    Add to Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Status */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-foreground mb-4">Event Status</h3>
                <Badge variant={isUpcoming ? 'default' : 'secondary'} className="text-sm">
                  {isUpcoming ? 'Upcoming' : 'Past Event'}
                </Badge>
              </CardContent>
            </Card>

            {/* Category */}
            {event.category && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-4">Category</h3>
                  <Badge className="bg-[var(--brand-orange)] border-0 text-white">{event.category}</Badge>
                </CardContent>
              </Card>
            )}

            {/* Registration Info */}
            {event.registrationRequired && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-4">Registration</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isUpcoming ? 'Registration is required for this event.' : 'Registration has closed.'}
                  </p>
                  {event.registrationDeadline && isUpcoming && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {formatDate(event.registrationDeadline)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Related Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((related: { id: string; slug: string; title: string; date: string; location?: string | null; category?: string | null; description?: string | null; excerpt?: string | null }) => (
                <Link key={related.id} href={`/events/${related.slug}`}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="font-heading font-semibold text-foreground leading-snug mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(related.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      {related.category && (
                        <Badge variant="outline" className="text-xs">{related.category}</Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
