'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Smartphone, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const amounts = [500, 1000, 2500, 5000, 10000]

const features = [
  { icon: Shield, title: 'Secure & Encrypted', desc: 'Bank-level security on every transaction' },
  { icon: Smartphone, title: 'Mobile Money', desc: 'Airtel Money & TNM Mpamba supported' },
  { icon: Heart, title: 'Tax Deductible', desc: 'Official receipt provided for every gift' },
]

export function GivingSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Generosity</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-5 leading-tight">
              Give to Advance{' '}
              <span className="text-gradient-brand">God's Kingdom</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Your generosity funds ministry, supports missions, serves the community,
              and changes lives. Every gift — big or small — makes an eternal difference.
            </p>

            <div className="space-y-4 mb-8">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{title}</p>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="brand" size="lg" asChild>
              <Link href="/giving">
                Give Online Now <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right: Quick give widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8 shadow-sm"
          >
            <h3 className="font-heading font-bold text-xl text-foreground mb-6">Quick Give</h3>

            <p className="text-sm font-medium text-muted-foreground mb-3">Select an amount (MWK)</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  className="border border-border rounded-xl py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                >
                  {amt.toLocaleString()}
                </button>
              ))}
              <button className="border border-dashed border-border rounded-xl py-3 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all col-span-3">
                Custom Amount
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Giving For</label>
                <select className="w-full h-10 px-3 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>General Fund</option>
                  <option>Missions</option>
                  <option>Building Fund</option>
                  <option>Youth Ministry</option>
                </select>
              </div>
            </div>

            <Button variant="brand" size="lg" className="w-full" asChild>
              <Link href="/giving">Proceed to Give</Link>
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              🔒 Secured by 256-bit SSL encryption
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
