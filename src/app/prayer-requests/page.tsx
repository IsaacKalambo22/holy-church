import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = { title: 'Prayer Requests' }

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
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Prayer Request</CardTitle>
            <CardDescription>
              Your request will be kept confidential unless you choose to share it publicly. Our prayer team prays daily.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>First Name</Label><Input placeholder="Grace" /></div>
              <div className="space-y-1.5"><Label>Last Name</Label><Input placeholder="Phiri" /></div>
            </div>
            <div className="space-y-1.5"><Label>Email (optional)</Label><Input type="email" placeholder="you@email.com" /></div>
            <div className="space-y-1.5">
              <Label>Your Prayer Request</Label>
              <Textarea rows={6} placeholder="Share what is on your heart. Be as detailed as you would like..." />
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="anon" className="mt-0.5 w-4 h-4 rounded border-border accent-primary" />
              <label htmlFor="anon" className="text-sm text-muted-foreground leading-snug">
                Keep my request anonymous — only the prayer team will see my name
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="share" className="mt-0.5 w-4 h-4 rounded border-border accent-primary" />
              <label htmlFor="share" className="text-sm text-muted-foreground leading-snug">
                Allow this request to be shared with the congregation (name hidden)
              </label>
            </div>
            <Button variant="brand" size="lg" className="w-full">Submit Prayer Request</Button>
          </CardContent>
        </Card>

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
