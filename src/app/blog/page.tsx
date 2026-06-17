import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

const posts = [
  { slug: '1', title: 'Finding Peace in Uncertain Times', category: 'Faith', date: 'Jun 15, 2026', excerpt: 'Discover how Scripture guides us through life\'s most challenging seasons and how peace that surpasses understanding becomes real.', author: 'Pastor John Banda', gradient: 'from-purple-500 to-indigo-600' },
  { slug: '2', title: 'Why Community is Essential to Faith', category: 'Church Life', date: 'Jun 10, 2026', excerpt: 'We were never designed to do life alone. Here is why gathering together with other believers is not optional but essential.', author: 'Elder Grace Phiri', gradient: 'from-indigo-500 to-purple-600' },
  { slug: '3', title: 'A Devotional on Psalm 23', category: 'Devotional', date: 'Jun 5, 2026', excerpt: 'An in-depth look at one of the most beloved passages in Scripture and what it means to say "The Lord is my Shepherd."', author: 'Deacon Isaac Mwale', gradient: 'from-violet-500 to-purple-700' },
  { slug: '4', title: 'Mission Trip Recap: Serving Rural Malawi', category: 'Missions', date: 'May 28, 2026', excerpt: 'Our team shares stories, photos, and lessons from their recent outreach trip to Kasungu and Mchinji.', author: 'Missions Team', gradient: 'from-orange-400 to-rose-500' },
  { slug: '5', title: 'Youth Ministry: Building the Next Generation', category: 'Youth', date: 'May 22, 2026', excerpt: 'Exciting updates from our rapidly growing youth program and the vision we carry for the next generation of believers.', author: 'Youth Pastor', gradient: 'from-blue-500 to-indigo-600' },
  { slug: '6', title: 'How to Develop a Consistent Prayer Life', category: 'Prayer', date: 'May 18, 2026', excerpt: 'Practical, biblical strategies to help you build a prayer habit that sustains your faith and transforms your relationship with God.', author: 'Pastor John Banda', gradient: 'from-rose-400 to-orange-500' },
]

const catColors: Record<string, 'default' | 'secondary' | 'outline'> = { Faith: 'default', 'Church Life': 'secondary', Devotional: 'outline', Missions: 'default', Youth: 'secondary', Prayer: 'outline' }

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Blog</h1>
        <p className="text-white/70 text-xl">Articles, devotionals, and stories from our community</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                <div className={`h-44 rounded-t-xl bg-gradient-to-br ${post.gradient}`} />
                <CardHeader className="pt-5 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={catColors[post.category] || 'outline'}>{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">By {post.author}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
