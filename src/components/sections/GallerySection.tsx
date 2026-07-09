'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryItem {
  id: string
  caption: string
  imageUrls: string[]
}

export function GallerySection({ galleries = [] }: { galleries?: GalleryItem[] }) {
  // Flatten the most recent galleries into individual photos (max 8).
  const photos = galleries
    .flatMap((g) => (g.imageUrls || []).map((url) => ({ url, caption: g.caption })))
    .slice(0, 8)

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Life Together</span>
            <h2 className="font-heading text-4xl font-bold text-foreground mt-2">Gallery</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/gallery">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.url + i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || ''}
                  className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {photo.caption && (
                  <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                      {photo.caption}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-background/50 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ImageIcon className="h-7 w-7" />
            </div>
            <p className="max-w-sm text-muted-foreground">Photos from our life together will appear here soon.</p>
          </div>
        )}
      </div>
    </section>
  )
}
