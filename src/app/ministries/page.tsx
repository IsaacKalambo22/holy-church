import type { Metadata } from 'next'
import { Music, Users, Baby, BookOpen, Globe, Heart, Mic2, Cross } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Ministries' }

const ministries = [
  { icon: Music, name: 'Worship Ministry', desc: 'Leading the congregation into the presence of God through anointed music, song, and creative expression. We rehearse weekly and serve every Sunday.', lead: 'Worship Director', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  { icon: Users, name: 'Young Adults', desc: 'A vibrant, relevant ministry for those aged 18–35. We meet weekly for fellowship, discipleship, and fun in a relaxed environment.', lead: 'Young Adults Pastor', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { icon: Baby, name: "Children's Ministry", desc: 'Building faith foundations for children aged 3–12 through age-appropriate Bible teaching, worship, and creative activities every Sunday.', lead: "Children's Director", color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  { icon: BookOpen, name: 'Bible Study', desc: 'Deep, systematic study of Scripture every Wednesday evening. All levels welcome — from new believers to seasoned students of the Word.', lead: 'Teaching Pastor', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  { icon: Globe, name: 'Missions', desc: 'Reaching the unreached through local outreach, national partnerships, and international mission trips. We exist to carry the gospel beyond our walls.', lead: 'Missions Coordinator', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  { icon: Heart, name: 'Care & Counselling', desc: 'Professional pastoral counselling and peer support for those walking through grief, trauma, addiction, or personal crisis. Confidential and compassionate.', lead: 'Pastoral Care Team', color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' },
  { icon: Mic2, name: 'Media & Creative', desc: 'Serving behind the scenes with video, audio, photography, and design. Help us tell the story of what God is doing through compelling creative work.', lead: 'Media Director', color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30' },
  { icon: Cross, name: 'Prayer Ministry', desc: 'Interceding for the church, city, and nations. Join our Friday night prayer gatherings or our dedicated prayer chain for urgent needs.', lead: 'Prayer Coordinator', color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30' },
]

export default function MinistriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Our Ministries</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Find your place. Use your gifts. Make a difference.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {ministries.map(({ icon: Icon, name, desc, lead, color }) => (
            <Card key={name} className="hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{lead}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed mb-4">{desc}</CardDescription>
                <Button size="sm" variant="outline">Get Involved</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl gradient-hero p-12 text-center text-white">
          <h2 className="font-heading text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            Take our ministry match survey and we will help connect you with the ministry that best fits your gifts and passions.
          </p>
          <Button className="bg-white text-[var(--brand-indigo)] font-semibold hover:bg-white/90" size="lg" asChild>
            <Link href="/contact">Talk to Our Team</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
