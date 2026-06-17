import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MinistryCard } from '@/components/shared/MinistryCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ministries — Holy Church Assembly',
  description: 'Discover the various ministries at Holy Church Assembly. From worship to outreach, find your place to serve and grow.',
  keywords: ['ministries', 'worship', 'youth', 'children', 'outreach', 'missions', 'serve'],
  openGraph: {
    title: 'Ministries — Holy Church Assembly',
    description: 'Find your place. Use your gifts. Make a difference.',
    type: 'website',
  },
}

async function getMinistries(searchParams: {
  search?: string
  category?: string
  status?: string
  sort?: string
  page?: string
}) {
  const params = new URLSearchParams()
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.category) params.set('category', searchParams.category)
  if (searchParams.status) params.set('status', searchParams.status)
  if (searchParams.sort) params.set('sort', searchParams.sort)
  params.set('page', searchParams.page || '1')
  params.set('limit', '10')

  const response = await fetch(`/api/ministries?${params.toString()}`, {
    next: { revalidate: 600 },
  })

  if (!response.ok) {
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }

  return response.json()
}

export default async function MinistriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    category?: string
    status?: string
    sort?: string
    page?: string
  }>
}) {
  const resolvedSearchParams = await searchParams
  const { data: ministries, page, totalPages } = await getMinistries(resolvedSearchParams)

  const categories = ['Worship', 'Youth', 'Children', 'Outreach', 'Missions', 'Care', 'Media', 'Prayer', 'Community']

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Our Ministries</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Find your place. Use your gifts. Make a difference.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Search ministries..." 
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
              defaultValue={resolvedSearchParams.sort || 'name'}
            >
              <option value="name">Alphabetical</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(resolvedSearchParams.search || resolvedSearchParams.category || resolvedSearchParams.status) && (
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
            {resolvedSearchParams.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {resolvedSearchParams.status}
              </Badge>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ministries">Clear Filters</Link>
            </Button>
          </div>
        )}

        {/* Ministries Grid */}
        {ministries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministries.map((ministry: { id: string; slug: string; name: string; description?: string | null; imageUrl?: string | null; category?: string | null; leader?: { name: string } | null }) => (
                <Link key={ministry.id} href={`/ministries/${ministry.slug}`}>
                  <MinistryCard
                    name={ministry.name}
                    description={ministry.description || ''}
                    imageUrl={ministry.imageUrl}
                    leader={ministry.leader?.name}
                  />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={`/ministries?page=${Number(page) - 1}`}>Previous</Link>
                  </Button>
                )}
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Button variant="outline" asChild>
                    <Link href={`/ministries?page=${Number(page) + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No ministries found matching your criteria.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/ministries">Clear Filters</Link>
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="rounded-3xl gradient-hero p-12 text-center text-white mt-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            Take our ministry match survey and we will help connect you with the ministry that best fits your gifts and passions.
          </p>
          <Button className="bg-white text-[var(--brand-indigo)] font-semibold hover:bg-white/90" size="lg" asChild>
            <Link href="/contact">Talk to Our Team</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
