'use client'

import { useState } from 'react'
import { FlameHero } from '@/components/shared/FlameHero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search, Users, DollarSign, FileText, Shield } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  id: string
  type: string
  title: string
  description?: string
  url: string
  metadata?: Record<string, unknown>
}

export default function AdminSearchPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  const handleSearch = async () => {
    if (!query || query.length < 2) return

    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('q', query)
      if (type) params.append('type', type)

      const response = await fetch(`/api/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.data?.results || [])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'member':
        return <Users className="w-4 h-4" />
      case 'donation':
        return <DollarSign className="w-4 h-4" />
      case 'notification':
        return <FileText className="w-4 h-4" />
      case 'audit':
        return <Shield className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'member':
        return 'bg-blue-100 text-blue-800'
      case 'donation':
        return 'bg-green-100 text-green-800'
      case 'notification':
        return 'bg-orange-100 text-orange-800'
      case 'audit':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Admin Search"
        description="Search members, donations, notifications, and audit logs"
        badge="Administrator"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Search Administrative Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search members, donations, notifications..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 px-3 border border-input rounded-lg bg-background text-foreground text-sm"
              >
                <option value="">All Types</option>
                <option value="members">Members</option>
                <option value="donations">Donations</option>
                <option value="notifications">Notifications</option>
                <option value="audit">Audit Logs</option>
              </select>
              <Button onClick={handleSearch} disabled={loading}>
                Search
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : !query ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search Administrative Records</h3>
                <p className="text-muted-foreground">
                  Enter a keyword to search members, donations, notifications, and audit logs.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try different keywords or filters.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result) => (
                  <Link key={result.id} href={result.url}>
                    <Card className="hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(result.type)}`}>
                            {getTypeIcon(result.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={getTypeColor(result.type)}>
                                {result.type}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-foreground mb-1">{result.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {result.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
