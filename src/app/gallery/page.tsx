import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { AlbumCard } from '@/components/shared/AlbumCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Gallery — Holy Church Assembly',
  description: 'View photos and videos from Holy Church Assembly events, services, and community life in Lilongwe, Malawi.',
  keywords: ['gallery', 'photos', 'videos', 'events', 'services', 'community'],
  openGraph: {
    title: 'Gallery — Holy Church Assembly',
    description: 'Moments captured from our life together.',
    type: 'website',
  },
}

async function getAlbums(page: string = '1') {
  const params = new URLSearchParams()
  params.set('page', page)
  params.set('limit', '12')

  const response = await fetch(`/api/gallery/albums?${params.toString()}`, {
    next: { revalidate: 600 },
  })

  if (!response.ok) {
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }

  return response.json()
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const { data: albums, page, totalPages } = await getAlbums(resolvedSearchParams.page)

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Gallery</h1>
        <p className="text-white/70 text-xl">Moments captured from our life together</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Albums Grid */}
        {albums.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album: {
                id: string
                name: string
                slug: string
                description?: string | null
                coverImage?: string | null
                _count: { mediaItems: number }
              }) => (
                <Link key={album.id} href={`/gallery/${album.slug}`}>
                  <AlbumCard
                    name={album.name}
                    description={album.description}
                    coverImage={album.coverImage}
                    mediaCount={album._count.mediaItems}
                  />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={`/gallery?page=${Number(page) - 1}`}>Previous</Link>
                  </Button>
                )}
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Button variant="outline" asChild>
                    <Link href={`/gallery?page=${Number(page) + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No albums found.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon for new content!</p>
          </div>
        )}
      </div>
    </div>
  )
}
