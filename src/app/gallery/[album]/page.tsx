import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { MediaCard } from '@/components/shared/MediaCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getAlbum(slug: string) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/gallery/albums/slug/${slug}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const result = await response.json()
  return result.data as {
    id: string
    name: string
    slug: string
    description?: string | null
    coverImage?: string | null
    mediaItems: Array<{
      id: string
      title?: string | null
      description?: string | null
      type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'
      url: string
      thumbnailUrl?: string | null
      createdAt: string
    }>
  } | null
}

export async function generateMetadata({ params }: { params: Promise<{ album: string }> }): Promise<Metadata> {
  const { album: albumSlug } = await params
  const album = await getAlbum(albumSlug)

  if (!album) {
    return {
      title: 'Album Not Found',
    }
  }

  return {
    title: `${album.name} — Holy Church Assembly Gallery`,
    description: album.description || `View photos and videos from ${album.name}.`,
    openGraph: {
      title: album.name,
      description: album.description || undefined,
      type: 'website',
      images: album.coverImage ? [{ url: album.coverImage }] : undefined,
    },
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const { album: albumSlug } = await params
  const album = await getAlbum(albumSlug)

  if (!album) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {album.coverImage ? (
        <div className="relative h-64 md:h-80">
          <img
            src={album.coverImage}
            alt={album.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <Link href="/gallery" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Link>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">{album.name}</h1>
          </div>
        </div>
      ) : (
        <div className="gradient-hero py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Link href="/gallery" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Link>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">{album.name}</h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Album Info */}
        <div className="mb-8">
          {album.description && (
            <p className="text-muted-foreground text-lg leading-relaxed">{album.description}</p>
          )}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              {album.mediaItems.length} {album.mediaItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Media Grid */}
        {album.mediaItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {album.mediaItems.map((item) => (
              <MediaCard
                key={item.id}
                title={item.title}
                description={item.description}
                type={item.type}
                url={item.url}
                thumbnailUrl={item.thumbnailUrl}
                createdAt={item.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No media items in this album yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
