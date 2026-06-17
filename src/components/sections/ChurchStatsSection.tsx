'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, Heart, Globe } from 'lucide-react'

const stats = [
  { icon: Users, value: '10,000+', label: 'Church Members', desc: 'Growing family of believers' },
  { icon: BookOpen, value: '500+', label: 'Sermons Preached', desc: 'Word-centered messages' },
  { icon: Heart, value: '25+', label: 'Active Ministries', desc: 'Serving every generation' },
  { icon: Globe, value: '15+', label: 'Years of Ministry', desc: 'Faithful since 2010' },
]

export function ChurchStatsSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-heading text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="font-semibold text-foreground text-sm">{stat.label}</p>
                <p className="text-muted-foreground text-xs mt-1">{stat.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
