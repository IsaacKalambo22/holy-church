'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Music, Users, Baby, BookOpen, Globe, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const ministries = [
  { icon: Music, name: 'Worship Ministry', desc: 'Leading hearts into the presence of God through music and praise.', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
  { icon: Users, name: 'Young Adults', desc: 'A vibrant community for ages 18–35, navigating life and faith together.', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
  { icon: Baby, name: "Children's Ministry", desc: 'Building faith foundations for kids ages 3–12 through fun and Scripture.', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' },
  { icon: BookOpen, name: 'Bible Study', desc: 'Deep-dive weekly sessions exploring the depth and richness of Scripture.', color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
  { icon: Globe, name: 'Missions', desc: 'Carrying the gospel beyond borders — locally and internationally.', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
  { icon: Heart, name: 'Care & Counselling', desc: 'Walking alongside people through life\'s hardest seasons with grace.', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' },
]

export function MinistriesSection() {
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
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Our Ministries
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            There is a place for everyone in our church family. Find where you belong.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {ministries.map((ministry, i) => {
            const Icon = ministry.icon
            return (
              <motion.div
                key={ministry.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${ministry.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{ministry.name}</CardTitle>
                    <CardDescription>{ministry.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-primary text-sm font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                      Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center">
          <Button variant="brand" size="lg" asChild>
            <Link href="/ministries">View All Ministries</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
