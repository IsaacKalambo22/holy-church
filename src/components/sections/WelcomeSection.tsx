'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function WelcomeSection() {
  return (
    <section className="py-24 px-4 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Pastor image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-border shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/Pastor2.jpeg"
                alt="Senior Pastor, Holy Church Assembly"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            </div>
            {/* Decorative card */}
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl p-5 shadow-xl max-w-[220px]">
              <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center mb-3">
                <span className="text-white text-lg">✦</span>
              </div>
              <p className="font-heading font-semibold text-foreground text-sm leading-snug">
                "Come as you are. Leave transformed."
              </p>
              <p className="text-xs text-muted-foreground mt-2">— Senior Pastor</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              A Message From Our Pastor
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6 leading-tight">
              Welcome to the{' '}
              <span className="text-gradient-brand">Holy Church Assembly</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We are so glad you found your way here. Whether you are searching for answers,
                seeking community, or just curious — you are welcome exactly as you are.
              </p>
              <p>
                Holy Church Assembly is more than a building. It is a family of believers
                passionate about loving God, loving people, and making a difference in our
                world. We believe every life carries divine purpose.
              </p>
              <p>
                Come visit us this Sunday. Bring your questions, your doubts, your hopes.
                There is a seat saved for you.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button variant="brand" size="lg" asChild>
                <Link href="/about">Meet Our Team</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">Plan Your Visit</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
