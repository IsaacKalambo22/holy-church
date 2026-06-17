import type { Metadata } from 'next'
import { Shield, Smartphone, Heart, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Give Online — Holy Church Assembly',
  description: 'Support the mission of Holy Church Assembly through secure online giving. Your generosity fuels our work in Malawi.',
  keywords: ['give', 'donate', 'offering', 'tithe', 'generosity', 'support'],
  openGraph: {
    title: 'Give Online — Holy Church Assembly',
    description: 'Your generosity fuels the mission. Every gift matters.',
    type: 'website',
  },
}

const amounts = [500, 1000, 2500, 5000, 10000, 25000]
const funds = ['General Fund', 'Missions Fund', 'Building Fund', 'Youth Ministry', 'Community Outreach', "Children's Ministry"]
const features = [
  { icon: Shield, title: 'Secure & Safe', desc: '256-bit SSL encrypted transactions' },
  { icon: Smartphone, title: 'Mobile Money', desc: 'Airtel Money & TNM Mpamba' },
  { icon: Heart, title: 'Tax Receipt', desc: 'Official receipt on every gift' },
  { icon: TrendingUp, title: 'Recurring Giving', desc: 'Set up weekly or monthly giving' },
]

export default function GivingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <Heart className="w-14 h-14 mx-auto mb-4 text-[var(--brand-orange)]" />
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Give Online</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Your generosity fuels the mission. Every gift matters.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>All transactions are secure and encrypted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Select Amount (MWK)</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {amounts.map((amt) => (
                      <button key={amt} className="border border-border rounded-xl py-3 text-sm font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                        {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">MWK</span>
                    <Input className="pl-14" placeholder="Custom amount" type="number" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fund" className="mb-1.5 block">Giving For</Label>
                  <select id="fund" className="w-full h-10 px-3 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {funds.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <Label className="mb-3 block">Frequency</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['One-time', 'Monthly', 'Weekly'].map((freq) => (
                      <button key={freq} className="border border-border rounded-xl py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-all">
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>First Name</Label><Input placeholder="John" /></div>
                  <div className="space-y-1.5"><Label>Last Name</Label><Input placeholder="Banda" /></div>
                </div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="john@email.com" /></div>
                <div className="space-y-1.5">
                  <Label>Personal Note (optional)</Label>
                  <Input placeholder="A message for the church..." />
                </div>

                <Button variant="brand" size="lg" className="w-full">Proceed to Payment</Button>
                <p className="text-xs text-muted-foreground text-center">🔒 Secured by 256-bit SSL encryption</p>
              </CardContent>
            </Card>
          </div>

          {/* Side info */}
          <div className="lg:col-span-2 space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{title}</p>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              </div>
            ))}
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm font-semibold text-foreground mb-2">📖 Biblical Principle</p>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
