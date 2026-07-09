'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Church } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface MinistryItem {
  id: string
  slug?: string | null
  name: string
  description?: string | null
  imageUrl?: string | null
  category?: string | null
}

export function MinistriesSection({ ministries = [] }: { ministries?: MinistryItem[] }) {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Get Involved</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">Our Ministries</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            There is a place for everyone in our church family. Find where you belong.
          </p>
        </motion.div>

        {ministries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {ministries.map((ministry, i) => (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={ministry.slug ? `/ministries/${ministry.slug}` : '/ministries'}>
                    <Card className="h-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer">
                      <div className="relative h-40 gradient-hero overflow-hidden">
                        {ministry.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ministry.imageUrl}
                            alt={ministry.name}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Church className="h-10 w-10 text-white/80" />
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{ministry.name}</CardTitle>
                        {ministry.description && (
                          <CardDescription className="line-clamp-2">{ministry.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <span className="text-primary text-sm font-semibold flex items-center gap-1">
                          Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Button variant="brand" size="lg" asChild>
                <Link href="/ministries">View All Ministries</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-background/50 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Church className="h-7 w-7" />
            </div>
            <p className="max-w-sm text-muted-foreground">Ministries will appear here once they&apos;re added.</p>
          </div>
        )}
      </div>
    </section>
  )
}
