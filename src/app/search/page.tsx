import { headers } from 'next/headers'
import { FlameHero } from '@/components/shared/FlameHero'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, Calendar, Layers, FileText, Image } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  id: string
  type: string
  title: string
  description?: string
  url: string
  metadata?: Record<string, unknown>
}

async function getSearchResults(query: string, type?: string) {
  const params = new URLSearchParams()
  params.append('q', query)
  if (type) params.append('type', type)

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`

  const response = await fetch(`${baseUrl}/api/search?${params}`, {
    cache: 'no-store',
  })

  if (!response.ok) return { results: [], total: 0 }
  return response.json()
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string }
}) {
  const query = searchParams.q || ''
  const type = searchParams.type || ''

  const searchData = query ? await getSearchResults(query, type) : { results: [], total: 0 }
  const results: SearchResult[] = searchData.data?.results || []
  const total = searchData.data?.total || 0

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sermon':
        return <BookOpen className="w-4 h-4" />
      case 'event':
        return <Calendar className="w-4 h-4" />
      case 'ministry':
        return <Layers className="w-4 h-4" />
      case 'blog':
        return <FileText className="w-4 h-4" />
      case 'gallery':
        return <Image className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sermon':
        return 'bg-blue-100 text-blue-800'
      case 'event':
        return 'bg-purple-100 text-purple-800'
      case 'ministry':
        return 'bg-green-100 text-green-800'
      case 'blog':
        return 'bg-orange-100 text-orange-800'
      case 'gallery':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Search"
        description="Find sermons, events, ministries, and more"
        badge="Search"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <form className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search for sermons, events, ministries, blog posts..."
              className="pl-12 h-14 text-lg"
            />
            <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
              Search
            </Button>
          </div>
        </form>

        {query && (
          <div className="flex gap-2 mb-6">
            <Link href={`/search?q=${encodeURIComponent(query)}`}>
              <Badge variant={type === '' ? 'default' : 'outline'}>All</Badge>
            </Link>
            <Link href={`/search?q=${encodeURIComponent(query)}&type=sermons`}>
              <Badge variant={type === 'sermons' ? 'default' : 'outline'}>Sermons</Badge>
            </Link>
            <Link href={`/search?q=${encodeURIComponent(query)}&type=events`}>
              <Badge variant={type === 'events' ? 'default' : 'outline'}>Events</Badge>
            </Link>
            <Link href={`/search?q=${encodeURIComponent(query)}&type=ministries`}>
              <Badge variant={type === 'ministries' ? 'default' : 'outline'}>Ministries</Badge>
            </Link>
            <Link href={`/search?q=${encodeURIComponent(query)}&type=blog`}>
              <Badge variant={type === 'blog' ? 'default' : 'outline'}>Blog</Badge>
            </Link>
            <Link href={`/search?q=${encodeURIComponent(query)}&type=gallery`}>
              <Badge variant={type === 'gallery' ? 'default' : 'outline'}>Gallery</Badge>
            </Link>
          </div>
        )}

        {!query ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search Holy Church Assembly</h3>
              <p className="text-muted-foreground">
                Enter a keyword to find sermons, events, ministries, blog posts, and more.
              </p>
            </CardContent>
          </Card>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try different keywords or browse our content directly.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{total} results found</p>
            {results.map((result) => {
              const date = result.metadata?.date as string | undefined
              const preacher = result.metadata?.preacher as string | undefined
              const location = result.metadata?.location as string | undefined

              return (
                <Link key={result.id} href={result.url}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getTypeColor(result.type)}>
                              {result.type}
                            </Badge>
                            {date && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{result.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.description}
                          </p>
                          {preacher && (
                            <p className="text-xs text-muted-foreground mt-1">
                              By {preacher}
                            </p>
                          )}
                          {location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {location}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
