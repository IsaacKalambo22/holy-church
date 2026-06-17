import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SermonCard } from '@/components/shared/SermonCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sermons — Holy Church Assembly',
  description: 'Watch and listen to sermons from Holy Church Assembly. Biblical teaching, spiritual growth, and practical wisdom for daily life.',
  keywords: ['sermons', 'teaching', 'preaching', 'messages', 'Bible study'],
  openGraph: {
    title: 'Sermons — Holy Church Assembly',
    description: 'Watch, listen, and grow in your walk with God.',
    type: 'website',
  },
}

async function getSermons(searchParams: {
  search?: string
  series?: string
  speaker?: string
  year?: string
  sort?: string
  page?: string
}) {
  const params = new URLSearchParams()
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.series) params.set('series', searchParams.series)
  if (searchParams.speaker) params.set('speaker', searchParams.speaker)
  if (searchParams.year) params.set('year', searchParams.year)
  if (searchParams.sort) params.set('sort', searchParams.sort)
  params.set('page', searchParams.page || '1')
  params.set('limit', '12')

  const response = await fetch(`/api/sermons?${params.toString()}`, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }

  return response.json()
}

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    series?: string
    speaker?: string
    year?: string
    sort?: string
    page?: string
  }>
}) {
  const resolvedSearchParams = await searchParams
  const { data: sermons, page, totalPages } = await getSermons(resolvedSearchParams)

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl font-bold text-white mb-3">Sermons</h1>
          <p className="text-white/70 text-xl">Watch, listen, and grow in your walk with God</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Search sermons, series, or preachers..." 
              defaultValue={resolvedSearchParams.search}
              name="search"
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="h-10 px-3 border border-input rounded-lg bg-background text-sm"
              name="series"
              defaultValue={resolvedSearchParams.series}
            >
              <option value="">All Series</option>
              <option value="Faith Series">Faith Series</option>
              <option value="Grace Series">Grace Series</option>
              <option value="Life Series">Life Series</option>
            </select>
            <select 
              className="h-10 px-3 border border-input rounded-lg bg-background text-sm"
              name="sort"
              defaultValue={resolvedSearchParams.sort || 'newest'}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(resolvedSearchParams.search || resolvedSearchParams.series || resolvedSearchParams.speaker || resolvedSearchParams.year) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {resolvedSearchParams.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {resolvedSearchParams.search}
              </Badge>
            )}
            {resolvedSearchParams.series && (
              <Badge variant="secondary" className="gap-1">
                Series: {resolvedSearchParams.series}
              </Badge>
            )}
            {resolvedSearchParams.speaker && (
              <Badge variant="secondary" className="gap-1">
                Speaker: {resolvedSearchParams.speaker}
              </Badge>
            )}
            {resolvedSearchParams.year && (
              <Badge variant="secondary" className="gap-1">
                Year: {resolvedSearchParams.year}
              </Badge>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sermons">Clear Filters</Link>
            </Button>
          </div>
        )}

        {/* Sermons Grid */}
        {sermons.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon: { id: string; slug: string; title: string; preacher?: { name: string } | null; series?: string | null; date: string; thumbnailUrl?: string | null }) => (
                <Link key={sermon.id} href={`/sermons/${sermon.slug}`}>
                  <SermonCard
                    title={sermon.title}
                    preacher={sermon.preacher?.name || 'Unknown'}
                    series={sermon.series || undefined}
                    date={new Date(sermon.date).toLocaleDateString()}
                    thumbnailUrl={sermon.thumbnailUrl}
                  />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={`/sermons?page=${Number(page) - 1}`}>Previous</Link>
                  </Button>
                )}
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Button variant="outline" asChild>
                    <Link href={`/sermons?page=${Number(page) + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No sermons found matching your criteria.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/sermons">Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
