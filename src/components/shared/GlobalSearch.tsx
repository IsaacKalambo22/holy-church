'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, Calendar, Layers, FileText, Image, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  type: string
  title: string
  description?: string
  url: string
  metadata?: Record<string, unknown>
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
      if (open && !loading && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          router.push(results[selectedIndex].url)
          setOpen(false)
        }
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, loading, results, selectedIndex, router])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
          if (response.ok) {
            const data = await response.json()
            setResults(data.data?.results || [])
          }
        } catch {
          setResults([])
        } finally {
          setLoading(false)
        }
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

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
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-all text-sm"
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Search...</span>
        <kbd className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold text-muted-foreground bg-muted rounded">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-full max-w-2xl bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="flex items-center border-b px-4">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sermons, events, ministries, blog posts..."
              className="border-0 focus-visible:ring-0 h-14 text-lg"
            />
            <button
              onClick={() => setOpen(false)}
              className="ml-2 p-2 hover:bg-accent rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : query.length < 2 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No results found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((result, index) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => setOpen(false)}
                    className={`block p-3 rounded-lg hover:bg-accent transition-all ${
                      index === selectedIndex ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(result.type)}`}>
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={getTypeColor(result.type)}>
                            {result.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-foreground truncate">{result.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="border-t px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">esc</kbd>
                Close
              </span>
            </div>
            <Link href="/search" onClick={() => setOpen(false)} className="hover:text-foreground">
              Advanced search →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
