'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const gradients = [
  'from-purple-500 to-indigo-600',
  'from-orange-400 to-rose-500',
  'from-indigo-600 to-purple-700',
  'from-violet-500 to-purple-600',
  'from-rose-400 to-orange-500',
  'from-purple-600 to-violet-700',
  'from-blue-500 to-indigo-600',
  'from-orange-500 to-amber-400',
]

const labels = [
  'Sunday Worship', 'Community Outreach', 'Youth Night', 'Bible Study',
  'Church Convention', 'Missions Trip', "Children's Day", 'Baptism Service',
]

export function GallerySection() {
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {gradients.map((gradient, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`relative aspect-square rounded-xl bg-gradient-to-br ${gradient} overflow-hidden group cursor-pointer`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                  {labels[i]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
