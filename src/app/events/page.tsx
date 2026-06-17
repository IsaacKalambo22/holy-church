import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EventCard } from '@/components/shared/EventCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Events — Holy Church Assembly',
  description: 'Stay connected with what God is doing in our community. Join us for worship, conferences, youth events, and outreach programs.',
  keywords: ['events', 'conferences', 'worship', 'youth', 'outreach', 'community'],
  openGraph: {
    title: 'Events — Holy Church Assembly',
    description: 'Stay connected with what God is doing in our community.',
    type: 'website',
  },
}

async function getEvents(searchParams: {
  search?: string
  category?: string
  location?: string
  status?: string
  sort?: string
  page?: string
}) {
  const params = new URLSearchParams()
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.category) params.set('category', searchParams.category)
  if (searchParams.location) params.set('location', searchParams.location)
  if (searchParams.status) params.set('status', searchParams.status)
  if (searchParams.sort) params.set('sort', searchParams.sort)
  params.set('page', searchParams.page || '1')
  params.set('limit', '10')

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/events?${params.toString()}`, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }

  return response.json()
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    category?: string
    location?: string
    status?: string
    sort?: string
    page?: string
  }>
}) {
  const resolvedSearchParams = await searchParams
  const { data: events, page, totalPages } = await getEvents(resolvedSearchParams)

  const categories = ['Convention', 'Youth', 'Outreach', 'Family', 'Prayer', 'Children', 'Worship', 'Missions', 'Community']

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl font-bold text-white mb-3">Events</h1>
          <p className="text-white/70 text-xl">Stay connected with what God is doing in our community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Search events, categories, or locations..." 
              defaultValue={resolvedSearchParams.search}
              name="search"
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="h-10 px-3 border border-input rounded-lg bg-background text-sm"
              name="category"
              defaultValue={resolvedSearchParams.category}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select 
              className="h-10 px-3 border border-input rounded-lg bg-background text-sm"
              name="sort"
              defaultValue={resolvedSearchParams.sort || 'upcoming'}
            >
              <option value="upcoming">Upcoming First</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(resolvedSearchParams.search || resolvedSearchParams.category || resolvedSearchParams.location || resolvedSearchParams.status) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {resolvedSearchParams.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {resolvedSearchParams.search}
              </Badge>
            )}
            {resolvedSearchParams.category && (
              <Badge variant="secondary" className="gap-1">
                Category: {resolvedSearchParams.category}
              </Badge>
            )}
            {resolvedSearchParams.location && (
              <Badge variant="secondary" className="gap-1">
                Location: {resolvedSearchParams.location}
              </Badge>
            )}
            {resolvedSearchParams.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {resolvedSearchParams.status}
              </Badge>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/events">Clear Filters</Link>
            </Button>
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event: { id: string; slug: string; title: string; date: string; endDate?: string | null; location?: string | null; category?: string | null; description?: string | null; excerpt?: string | null }) => (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <EventCard
                    title={event.title}
                    date={new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    location={event.location || undefined}
                    category={event.category || undefined}
                    description={event.excerpt || event.description || undefined}
                  />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={`/events?page=${Number(page) - 1}`}>Previous</Link>
                  </Button>
                )}
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Button variant="outline" asChild>
                    <Link href={`/events?page=${Number(page) + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/events">Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
