import type { Metadata } from 'next'
import { Heart, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PrayerCard } from '@/components/shared/PrayerCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Prayer Wall — Holy Church Assembly',
  description: 'Join us in prayer for our community. See prayer requests and pray for one another.',
  keywords: ['prayer wall', 'intercession', 'community prayer', 'prayer requests'],
  openGraph: {
    title: 'Prayer Wall — Holy Church Assembly',
    description: 'Join us in prayer for our community.',
    type: 'website',
  },
}

async function getPrayers(searchParams: {
  status?: string
  category?: string
  page?: string
}) {
  const params = new URLSearchParams()
  params.set('public', 'true')
  if (searchParams.status) params.set('status', searchParams.status)
  if (searchParams.category) params.set('category', searchParams.category)
  params.set('page', searchParams.page || '1')
  params.set('limit', '20')

  const response = await fetch(`/api/prayer?${params.toString()}`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }

  return response.json()
}

export default async function PrayerWallPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    category?: string
    page?: string
  }>
}) {
  const resolvedSearchParams = await searchParams
  const { data: prayers, page, totalPages } = await getPrayers(resolvedSearchParams)

  const categories = ['Healing', 'Family', 'Spiritual Growth', 'Financial', 'Guidance', 'Thanksgiving', 'Other']
  const statuses = ['PENDING', 'PRAYED', 'ANSWERED']

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <Heart className="w-14 h-14 mx-auto mb-4 text-[var(--brand-orange)]" />
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Prayer Wall</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Join us in prayer for our community</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <div className="flex gap-3 flex-wrap">
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
              name="status"
              defaultValue={resolvedSearchParams.status}
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(resolvedSearchParams.category || resolvedSearchParams.status) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {resolvedSearchParams.category && (
              <Badge variant="secondary" className="gap-1">
                Category: {resolvedSearchParams.category}
              </Badge>
            )}
            {resolvedSearchParams.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {resolvedSearchParams.status}
              </Badge>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/prayer/wall">Clear Filters</Link>
            </Button>
          </div>
        )}

        {/* Prayers Grid */}
        {prayers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prayers.map((prayer: {
                id: string
                request: string
                title?: string | null
                category?: string | null
                status: string
                isAnonymous: boolean
                createdAt: string
                user?: { name: string } | null
              }) => (
                <PrayerCard
                  key={prayer.id}
                  request={prayer.request}
                  author={prayer.isAnonymous ? undefined : prayer.user?.name}
                  date={new Date(prayer.createdAt).toLocaleDateString()}
                  isAnonymous={prayer.isAnonymous}
                  status={prayer.status as 'PENDING' | 'PRAYED' | 'ANSWERED'}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={`/prayer/wall?page=${Number(page) - 1}`}>Previous</Link>
                  </Button>
                )}
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Button variant="outline" asChild>
                    <Link href={`/prayer/wall?page=${Number(page) + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No prayer requests found.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/prayer">Submit a Prayer Request</Link>
            </Button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="rounded-3xl gradient-hero p-12 text-white">
            <h2 className="font-heading text-3xl font-bold mb-4">Have a Prayer Request?</h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
              Our prayer team is ready to pray with you. Submit your request and let us stand with you in faith.
            </p>
            <Button className="bg-white text-[var(--brand-indigo)] font-semibold hover:bg-white/90" size="lg" asChild>
              <Link href="/prayer">Submit Prayer Request</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
