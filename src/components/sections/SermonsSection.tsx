'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SermonItem {
  id: string
  slug?: string | null
  title: string
  series?: string | null
  thumbnailUrl?: string | null
  date?: string | null
  preacher?: { name: string } | null
}

function fmt(date?: string | null) {
  if (!date) return ''
  const d = new Date(date)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function SermonsSection({ sermons = [] }: { sermons?: SermonItem[] }) {
  return (
    <section className="py-24 px-4 bg-muted/40">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Watch & Listen
            </span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-2">Latest Sermons</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/sermons">
              View All Sermons
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {sermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sermons.map((sermon, i) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={sermon.slug ? `/sermons/${sermon.slug}` : '/sermons'}>
                  <Card className="group overflow-hidden cursor-pointer h-full">
                    <div className="relative h-52 gradient-hero overflow-hidden">
                      {sermon.thumbnailUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sermon.thumbnailUrl}
                          alt={sermon.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center transition-transform group-hover:scale-110">
                          <Play className="w-7 h-7 text-white ml-1" />
                        </div>
                      </div>
                      {sermon.series && (
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-brand-orange text-white border-0 text-xs">{sermon.series}</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-5">
                      <h3 className="font-heading font-semibold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                        {sermon.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{sermon.preacher?.name || 'Holy Church Assembly'}</p>
                      <div className="flex items-center justify-end text-xs text-muted-foreground">
                        <span>{fmt(sermon.date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptySection icon={<BookOpen className="h-7 w-7" />} text="No sermons have been published yet. Check back soon." />
        )}
      </div>
    </section>
  )
}

function EmptySection({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-background/50 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</div>
      <p className="max-w-sm text-muted-foreground">{text}</p>
    </div>
  )
}
