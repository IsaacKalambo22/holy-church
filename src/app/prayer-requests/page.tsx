import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { PrayerRequestForm } from '@/components/shared/PrayerRequestForm'

export const metadata: Metadata = {
  title: 'Prayer Requests — Holy Church Assembly',
  description: 'Submit a prayer request at Holy Church Assembly. We believe prayer changes things.',
  keywords: ['prayer', 'prayer request', 'intercession', 'spiritual support'],
  openGraph: {
    title: 'Prayer Requests — Holy Church Assembly',
    description: 'We believe prayer changes things. Share your heart.',
    type: 'website',
  },
}

export default function PrayerRequestsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-white/15 border border-white/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🙏</span>
        </div>
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Prayer Requests</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">
          We believe prayer changes things. Share your heart — our team prays for every request.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-14">
        <PrayerRequestForm />

        <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-sm font-semibold text-foreground mb-2">Need to speak to someone urgently?</p>
          <p className="text-muted-foreground text-sm mb-4">
            Our pastoral care team is available Monday–Friday, 8 AM–5 PM.
          </p>
          <Button variant="outline" size="sm">Call +265 999 000 000</Button>
        </div>
      </div>
    </div>
  )
}
