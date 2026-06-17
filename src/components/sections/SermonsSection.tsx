'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const sermons = [
  { title: 'Walking in the Fullness of God', preacher: 'Pastor John Banda', series: 'Faith Series', duration: '48 min', date: 'Jun 15, 2026', thumbnail: null },
  { title: 'The Power of the Resurrection', preacher: 'Elder Grace Phiri', series: 'Easter Series', duration: '41 min', date: 'Jun 8, 2026', thumbnail: null },
  { title: 'Finding Purpose in Chaos', preacher: 'Pastor John Banda', series: 'Life Series', duration: '52 min', date: 'Jun 1, 2026', thumbnail: null },
]

export function SermonsSection() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sermons.map((sermon, i) => (
            <motion.div
              key={sermon.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group overflow-hidden cursor-pointer h-full">
                {/* Thumbnail */}
                <div className="relative h-52 gradient-hero overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center"
                    >
                      <Play className="w-7 h-7 text-white ml-1" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-[var(--brand-orange)] text-white border-0 text-xs">
                      {sermon.series}
                    </Badge>
                  </div>
                </div>

                <CardContent className="pt-5">
                  <h3 className="font-heading font-semibold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                    {sermon.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{sermon.preacher}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {sermon.duration}
                    </div>
                    <span>{sermon.date}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
