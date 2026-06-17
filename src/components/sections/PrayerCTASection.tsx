'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PrayerCTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-95" />
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">🙏</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-5">
            We Believe in the Power of Prayer
          </h2>
          <p className="text-white/75 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Whatever you are facing — a health struggle, a broken relationship, financial pressure —
            you do not have to carry it alone. Our prayer team is ready to stand with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" className="bg-white text-[var(--brand-indigo)] font-semibold hover:bg-white/90" asChild>
              <Link href="/prayer-requests">Submit a Prayer Request</Link>
            </Button>
            <Button size="xl" className="bg-white/10 border border-white/30 text-white hover:bg-white/20" asChild>
              <Link href="/contact">Talk to a Pastor</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
