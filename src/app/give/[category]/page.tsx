import type { Metadata } from 'next'
import { Heart } from 'lucide-react'
import { DonationForm } from '@/components/shared/DonationForm'
import { notFound } from 'next/navigation'

const categoryLabels: Record<string, string> = {
  general: 'General Fund',
  missions: 'Missions Fund',
  building: 'Building Fund',
  youth: 'Youth Ministry',
  outreach: 'Community Outreach',
  children: "Children's Ministry",
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const label = categoryLabels[category] || category

  return {
    title: `Give to ${label} — Holy Church Assembly`,
    description: `Support ${label} at Holy Church Assembly through secure online giving.`,
    keywords: ['give', 'donate', label.toLowerCase(), 'generosity', 'support'],
    openGraph: {
      title: `Give to ${label}`,
      description: `Your generosity fuels ${label}. Every gift matters.`,
      type: 'website',
    },
  }
}

export default async function GiveCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params

  if (!categoryLabels[category]) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-20 px-4 text-center">
        <Heart className="w-14 h-14 mx-auto mb-4 text-[var(--brand-orange)]" />
        <h1 className="font-heading text-5xl font-bold text-white mb-3">Give to {categoryLabels[category]}</h1>
        <p className="text-white/70 text-xl max-w-xl mx-auto">Your generosity fuels this ministry. Every gift matters.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <DonationForm defaultCategory={category} />
      </div>
    </div>
  )
}
