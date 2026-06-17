import type { Metadata } from 'next'
import { Play, Search, Clock, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Sermons' }

const sermons = Array.from({ length: 9 }, (_, i) => ({
  id: `sermon-${i + 1}`,
  title: ['Walking in the Spirit', 'The Grace of God', 'Faith Over Fear', 'Renewed Mind', 'His Presence', 'Love One Another', 'The Great Commission', 'Living in Victory', 'Purpose Driven Life'][i],
  preacher: i % 2 === 0 ? 'Pastor John Banda' : 'Elder Grace Phiri',
  series: ['Faith Series', 'Grace Series', 'Life Series', 'Mind Renewal'][i % 4],
  duration: `${38 + i * 3} min`,
  date: `Jun ${i + 1}, 2026`,
}))

export default function SermonsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl font-bold text-white mb-3">Sermons</h1>
          <p className="text-white/70 text-xl">Watch, listen, and grow in your walk with God</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search sermons, series, or preachers..." />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <Card key={sermon.id} className="group overflow-hidden cursor-pointer">
              <div className="relative h-48 gradient-hero flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-[var(--brand-orange)] border-0 text-white text-xs">{sermon.series}</Badge>
                </div>
              </div>
              <CardContent className="pt-5">
                <h3 className="font-heading font-semibold text-foreground text-lg group-hover:text-primary transition-colors mb-1">{sermon.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{sermon.preacher}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{sermon.duration}</span>
                  <span>{sermon.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
