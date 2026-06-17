import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/shared/BlogCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getCategory(slug: string) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/blog/categories`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const result = await response.json()
  return result.data.find((cat: { slug: string }) => cat.slug === slug) || null
}

async function getBlogPosts(categoryId: string, page: string = '1') {
  const params = new URLSearchParams()
  params.set('published', 'true')
  params.set('categoryId', categoryId)
  params.set('page', page)
  params.set('limit', '9')

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`

  const response = await fetch(`${baseUrl}/api/blog?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }

  return response.json()
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategory(params.slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} — Holy Church Assembly Blog`,
    description: category.description || `Read articles in the ${category.name} category.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: Promise<{ page?: string }>
}) {
  const category = await getCategory(params.slug)
  
  if (!category) {
    notFound()
  }

  const resolvedSearchParams = await searchParams
  const { data: posts, page, totalPages } = await getBlogPosts(category.id, resolvedSearchParams.page)

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">{category.name}</h1>
        {category.description && (
          <p className="text-white/70 text-xl max-w-2xl mx-auto">{category.description}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
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
                    <Link href={`/blog/category/${params.slug}?page=${Number(page) - 1}`}>Previous</Link>
                  </Button>
                )}
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Button variant="outline" asChild>
                    <Link href={`/blog/category/${params.slug}?page=${Number(page) + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No articles found in this category.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/blog">Browse All Articles</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
