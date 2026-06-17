import type { Metadata } from 'next'
import { Heart } from 'lucide-react'
import { DonationForm } from '@/components/shared/DonationForm'

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

export default function GivingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <Heart className="w-14 h-14 mx-auto mb-4 text-[var(--brand-orange)]" />
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Give Online</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Your generosity fuels the mission. Every gift matters.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <DonationForm />
      </div>
    </div>
  )
}
