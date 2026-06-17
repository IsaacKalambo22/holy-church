import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BlogCard } from '@/components/shared/BlogCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — Holy Church Assembly',
  description: 'Read articles, devotionals, and stories from Holy Church Assembly. Biblical teaching, church life updates, and spiritual encouragement.',
  keywords: ['blog', 'articles', 'devotionals', 'stories', 'teaching', 'faith'],
  openGraph: {
    title: 'Blog — Holy Church Assembly',
    description: 'Articles, devotionals, and stories from our community.',
    type: 'website',
  },
}

async function getBlogPosts(searchParams: {
  search?: string
  categoryId?: string
  page?: string
}) {
  const params = new URLSearchParams()
  params.set('published', 'true')
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId)
  params.set('page', searchParams.page || '1')
  params.set('limit', '9')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/api/blog?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }

  return response.json()
}

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/api/blog/categories`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return []
  }

  const result = await response.json()
  return result.data
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    categoryId?: string
    page?: string
  }>
}) {
  const resolvedSearchParams = await searchParams
  const { data: posts, page, totalPages } = await getBlogPosts(resolvedSearchParams)
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Blog</h1>
        <p className="text-white/70 text-xl">Articles, devotionals, and stories from our community</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Search articles..." 
              defaultValue={resolvedSearchParams.search}
              name="search"
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="h-10 px-3 border border-input rounded-lg bg-background text-sm"
              name="categoryId"
              defaultValue={resolvedSearchParams.categoryId}
            >
              <option value="">All Categories</option>
              {categories.map((cat: { id: string; name: string; slug: string }) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(resolvedSearchParams.search || resolvedSearchParams.categoryId) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {resolvedSearchParams.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {resolvedSearchParams.search}
              </Badge>
            )}
            {resolvedSearchParams.categoryId && (
              <Badge variant="secondary" className="gap-1">
                Category: {categories.find((c: { id: string }) => c.id === resolvedSearchParams.categoryId)?.name}
              </Badge>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">Clear Filters</Link>
            </Button>
          </div>
        )}

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: {
                id: string
                slug: string
                title: string
                excerpt?: string | null
                thumbnailUrl?: string | null
                category?: { name: string } | null
                author?: { name: string } | null
                publishedAt?: string | null
              }) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <BlogCard
                    title={post.title}
                    excerpt={post.excerpt}
                    thumbnailUrl={post.thumbnailUrl}
                    category={post.category?.name}
                    author={post.author?.name}
                    date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : undefined}
                    slug={post.slug}
                  />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={`/blog?page=${Number(page) - 1}`}>Previous</Link>
                  </Button>
                )}
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Button variant="outline" asChild>
                    <Link href={`/blog?page=${Number(page) + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/blog">Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
