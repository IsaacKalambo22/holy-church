'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden gradient-hero">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-purple rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-brand-orange rounded-full blur-[100px] opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              Sunday Service — 9:00 AM & 11:00 AM
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-[1.05] mb-6"
          >
            Where Every Soul{' '}
            <span className="text-gradient-brand">Finds Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/75 mb-10 max-w-2xl leading-relaxed"
          >
            A place of worship, grace, and spiritual transformation. Join thousands who have
            discovered life, community, and purpose here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="xl" variant="brand" asChild className="group">
              <Link href="/sermons">
                <Play className="w-5 h-5" />
                Watch Latest Sermon
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="xl"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex items-center gap-8"
          >
            {[
              { value: '10K+', label: 'Members' },
              { value: '500+', label: 'Sermons' },
              { value: '25+', label: 'Ministries' },
              { value: '15+', label: 'Years' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  )
}
