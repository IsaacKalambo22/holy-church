'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'

const services = [
  {
    day: 'Sunday',
    services: [
      { name: 'First Service', time: '9:00 AM', location: 'Main Sanctuary' },
      { name: 'Second Service', time: '11:00 AM', location: 'Main Sanctuary' },
      { name: "Children's Church", time: '9:00 AM', location: 'Kids Zone' },
    ],
  },
  {
    day: 'Wednesday',
    services: [{ name: 'Bible Study', time: '6:30 PM', location: 'Fellowship Hall' }],
  },
  {
    day: 'Friday',
    services: [
      { name: 'Prayer Night', time: '7:00 PM', location: 'Prayer Room' },
      { name: 'Youth Service', time: '6:00 PM', location: 'Youth Center' },
    ],
  },
]

export function ServiceTimesSection() {
  return (
    <section className="py-20 px-4 bg-[var(--brand-indigo)] text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-[var(--brand-orange)] uppercase tracking-widest">
            Join Us
          </span>
          <h2 className="font-heading text-4xl font-bold mt-2">Service Times</h2>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            We gather every week to worship together. All are welcome.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-[var(--brand-orange)] font-heading font-bold text-xl mb-4">
                {day.day}
              </div>
              <div className="space-y-4">
                {day.services.map((s) => (
                  <div key={s.name} className="border-t border-white/10 pt-4 first:border-0 first:pt-0">
                    <p className="font-semibold text-white">{s.name}</p>
                    <div className="flex items-center gap-2 text-white/60 text-sm mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {s.time}
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {s.location}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
