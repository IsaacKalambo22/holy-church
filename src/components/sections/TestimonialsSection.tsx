'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Chisomo Banda',
    role: 'Member since 2018',
    avatar: 'CB',
    text: 'Holy Church Assembly completely transformed my life. I came broken and lost, and this community loved me back to wholeness. I found not just faith, but family.',
  },
  {
    name: 'Grace Phiri',
    role: 'Youth Leader',
    avatar: 'GP',
    text: 'The teaching here is deep, practical, and rooted in the Word. Every Sunday I leave with something that shapes how I live the rest of the week. Truly life-changing.',
  },
  {
    name: 'Mphatso Msusa',
    role: 'Member since 2021',
    avatar: 'MM',
    text: 'I was hesitant to come at first. But from day one, the warmth and acceptance were overwhelming. This church truly practices what it preaches — unconditional love.',
  },
  {
    name: 'Tadala Mkwanda',
    role: 'Worship Team',
    avatar: 'TM',
    text: 'Serving in the worship ministry here has been the greatest honour. We do not just perform — we lead people into genuine encounters with God. That is rare and beautiful.',
  },
  {
    name: 'Isaac Mwale',
    role: 'Connect Group Leader',
    avatar: 'IM',
    text: 'The Connect Groups changed everything for me. It is where I formed my deepest friendships and grew the most in my faith. I could not imagine church without this community.',
  },
  {
    name: 'Rejoice Tembo',
    role: 'Member since 2020',
    avatar: 'RT',
    text: 'After years away from church, Holy Church Assembly welcomed me back with open arms. No judgment, no pressure — just love, grace, and the truth of God\'s Word.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Changed Lives</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            What Our Family Says
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real stories from real people whose lives were transformed by faith and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="w-8 h-8 text-primary/30 mb-4 flex-shrink-0" />
                  <p className="text-foreground/80 leading-relaxed text-sm flex-1 mb-6">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{t.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.role}</p>
                    </div>
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
