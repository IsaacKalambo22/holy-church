import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery — Holy Church Assembly',
  description: 'View photos and videos from Holy Church Assembly events, services, and community life in Lilongwe, Malawi.',
  keywords: ['gallery', 'photos', 'videos', 'events', 'services', 'community'],
  openGraph: {
    title: 'Gallery — Holy Church Assembly',
    description: 'Moments captured from our life together.',
    type: 'website',
  },
}

const items = [
  { label: 'Sunday Worship', gradient: 'from-purple-500 to-indigo-600' },
  { label: 'Church Convention', gradient: 'from-indigo-600 to-purple-700' },
  { label: 'Youth Night', gradient: 'from-blue-500 to-indigo-600' },
  { label: 'Community Outreach', gradient: 'from-orange-400 to-rose-500' },
  { label: 'Baptism Service', gradient: 'from-violet-500 to-purple-600' },
  { label: 'Prayer Night', gradient: 'from-purple-600 to-violet-700' },
  { label: 'Missions Trip', gradient: 'from-rose-400 to-orange-500' },
  { label: "Children's Day", gradient: 'from-yellow-400 to-orange-400' },
  { label: 'Bible Study', gradient: 'from-green-500 to-teal-500' },
  { label: 'Leadership Summit', gradient: 'from-indigo-500 to-blue-600' },
  { label: 'Worship Conference', gradient: 'from-purple-500 to-pink-500' },
  { label: 'Easter Celebration', gradient: 'from-orange-500 to-amber-400' },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Gallery</h1>
        <p className="text-white/70 text-xl">Moments captured from our life together</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className={`relative aspect-square rounded-2xl bg-gradient-to-br ${item.gradient} overflow-hidden group cursor-pointer`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-semibold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
