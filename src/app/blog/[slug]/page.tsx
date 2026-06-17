import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getBlogPost(slug: string) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/blog/slug/${slug}`, {
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
    excerpt?: string | null
    content?: string | null
    thumbnailUrl?: string | null
    status: string
    published: boolean
    publishedAt?: string | null
    author?: { id: string; name: string; avatar?: string | null } | null
    category?: { id: string; name: string; slug: string } | null
  } | null
}

async function getRelatedPosts(categoryId?: string) {
  if (!categoryId) return []
  
  const params = new URLSearchParams()
  params.set('published', 'true')
  params.set('categoryId', categoryId)
  params.set('limit', '4')
  
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/blog?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return []
  }

  const result = await response.json()
  return result.data.slice(0, 3)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} — Holy Church Assembly`,
    description: post.excerpt || post.content || `Read ${post.title} on the Holy Church Assembly blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.thumbnailUrl ? [{ url: post.thumbnailUrl }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post || !post.published) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category?.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {post.thumbnailUrl ? (
        <div className="relative h-64 md:h-80">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            {post.category && (
              <Badge className="bg-[var(--brand-orange)] border-0 text-white mb-3">{post.category.name}</Badge>
            )}
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">{post.title}</h1>
          </div>
        </div>
      ) : (
        <div className="gradient-hero py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            {post.category && (
              <Badge className="bg-[var(--brand-orange)] border-0 text-white mb-3">{post.category.name}</Badge>
            )}
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">{post.title}</h1>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Meta Info */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
          {post.author && (
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author.name}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Content */}
        {post.content && (
          <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}

        {/* Share Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related: {
                id: string
                slug: string
                title: string
                excerpt?: string | null
                thumbnailUrl?: string | null
                category?: { name: string } | null
                author?: { name: string } | null
                publishedAt?: string | null
              }) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    {related.thumbnailUrl && (
                      <div className="h-40 rounded-t-xl overflow-hidden">
                        <img
                          src={related.thumbnailUrl}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      {related.category && (
                        <Badge variant="outline" className="mb-2">{related.category.name}</Badge>
                      )}
                      <h3 className="font-heading font-semibold text-foreground leading-snug mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
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
