import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Play, Calendar, User, Share2, Heart, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVideoEmbed } from '@/lib/video'

async function getSermon(slug: string) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/sermons/slug/${slug}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const result = await response.json()
  return result.data as { id: string; title: string; slug: string; description?: string | null; date: string; videoUrl?: string | null; audioUrl?: string | null; thumbnailUrl?: string | null; series?: string | null; preacher?: { id: string; name: string; avatar?: string | null } | null; views: number } | null
}

async function getRelatedSermons(sermonId: string, series?: string) {
  const params = new URLSearchParams()
  params.set('limit', '4')
  if (series) params.set('series', series)
  
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/sermons?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return []
  }

  const result = await response.json()
  return result.data.filter((s: { id: string }) => s.id !== sermonId).slice(0, 3)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const sermon = await getSermon(params.slug)
  
  if (!sermon) {
    return {
      title: 'Sermon Not Found',
    }
  }

  return {
    title: `${sermon.title} — Holy Church Assembly`,
    description: sermon.description || `Watch sermon "${sermon.title}" by ${sermon.preacher?.name || 'Holy Church Assembly'}.`,
    openGraph: {
      title: sermon.title,
      description: sermon.description || `Sermon by ${sermon.preacher?.name}`,
      type: 'video.other',
      images: sermon.thumbnailUrl ? [{ url: sermon.thumbnailUrl }] : undefined,
    },
  }
}

export default async function SermonDetailsPage({ params }: { params: { slug: string } }) {
  const sermon = await getSermon(params.slug)
  
  if (!sermon) {
    notFound()
  }

  const relatedSermons = await getRelatedSermons(sermon.id, sermon.series || undefined)
  const videoEmbed = getVideoEmbed(sermon.videoUrl)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <Link href="/sermons" className="hover:text-white transition-colors">Sermons</Link>
            <span>/</span>
            <span>{sermon.series || 'Sermon'}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">{sermon.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            {sermon.preacher && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {sermon.preacher.name}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(sermon.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {sermon.series && (
              <Badge className="bg-[var(--brand-orange)] border-0 text-white">{sermon.series}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center">
                {videoEmbed?.kind === 'iframe' ? (
                  <iframe
                    src={videoEmbed.src}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={sermon.title}
                  />
                ) : videoEmbed?.kind === 'file' ? (
                  <video
                    src={videoEmbed.src}
                    controls
                    className="w-full h-full"
                    poster={sermon.thumbnailUrl || undefined}
                  />
                ) : (
                  <div className="text-center text-white/50">
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <p>Video coming soon</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Audio Player */}
            {sermon.audioUrl && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Button size="lg" variant="brand">
                      <Play className="w-5 h-5 mr-2" />
                      Play Audio
                    </Button>
                    <audio controls className="flex-1">
                      <source src={sermon.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {sermon.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">About This Sermon</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{sermon.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Share Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  {sermon.audioUrl && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Audio
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Speaker Info */}
            {sermon.preacher && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-4">Speaker</h3>
                  <div className="flex items-center gap-4">
                    {sermon.preacher.avatar ? (
                      <img
                        src={sermon.preacher.avatar}
                        alt={sermon.preacher.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{sermon.preacher.name}</p>
                      <p className="text-sm text-muted-foreground">Speaker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Series Info */}
            {sermon.series && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-4">Series</h3>
                  <Badge className="bg-primary text-white mb-2">{sermon.series}</Badge>
                  <p className="text-sm text-muted-foreground">
                    Part of the {sermon.series} teaching series.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-foreground mb-4">Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Views</span>
                    <span className="font-semibold text-foreground">{sermon.views || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Date</span>
                    <span className="font-semibold text-foreground">{new Date(sermon.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Sermons */}
        {relatedSermons.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Related Sermons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedSermons.map((related: { id: string; slug: string; title: string; preacher?: { name: string } | null }) => (
                <Link key={related.id} href={`/sermons/${related.slug}`}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white/80" />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-heading font-semibold text-foreground leading-snug mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{related.preacher?.name}</p>
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
