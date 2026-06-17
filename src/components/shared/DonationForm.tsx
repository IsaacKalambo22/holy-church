'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Heart, Shield, Smartphone, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  category: z.string().min(1, 'Please select a category'),
  donorName: z.string().min(2, 'Name is required'),
  donorEmail: z.string().email('Invalid email address'),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
})

type DonationFormData = z.infer<typeof donationSchema>

const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000]
const categories = [
  { value: 'general', label: 'General Fund' },
  { value: 'missions', label: 'Missions Fund' },
  { value: 'building', label: 'Building Fund' },
  { value: 'youth', label: 'Youth Ministry' },
  { value: 'outreach', label: 'Community Outreach' },
  { value: 'children', label: "Children's Ministry" },
]

const features = [
  { icon: Shield, title: 'Secure & Safe', desc: '256-bit SSL encrypted transactions' },
  { icon: Smartphone, title: 'Mobile Money', desc: 'Airtel Money & TNM Mpamba' },
  { icon: Heart, title: 'Tax Receipt', desc: 'Official receipt on every gift' },
  { icon: TrendingUp, title: 'Recurring Giving', desc: 'Set up weekly or monthly giving' },
]

interface DonationFormProps {
  defaultCategory?: string
  onSuccess?: (data: DonationFormData) => void
}

export function DonationForm({ defaultCategory, onSuccess }: DonationFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      category: defaultCategory || 'general',
      isAnonymous: false,
    },
  })

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${baseUrl}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          currency: 'MWK',
          paymentStatus: 'PENDING',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit donation')
      }

      onSuccess?.(data)
    } catch {
      setSubmitError('Failed to submit donation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Form */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>All transactions are secure and encrypted</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label className="mb-3 block">Select Amount (MWK)</Label>
                <div className="grid grid-cols-3 gap-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt)
                        setValue('amount', amt)
                      }}
                      className={`border rounded-xl py-3 text-sm font-semibold transition-all ${
                        selectedAmount === amt
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="mt-3 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">MWK</span>
                  <Input
                    className="pl-14"
                    placeholder="Custom amount"
                    type="number"
                    {...register('amount', { valueAsNumber: true })}
                    onChange={(e) => {
                      setSelectedAmount(null)
                      setValue('amount', parseFloat(e.target.value) || 0)
                    }}
                  />
                  {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="mb-1.5 block">Giving For</Label>
                <select
                  id="category"
                  className="w-full h-10 px-3 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register('category')}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input placeholder="John" {...register('donorName')} />
                  {errors.donorName && <p className="text-sm text-destructive">{errors.donorName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input placeholder="Banda" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="john@email.com" {...register('donorEmail')} />
                {errors.donorEmail && <p className="text-sm text-destructive">{errors.donorEmail.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Personal Note (optional)</Label>
                <Input placeholder="A message for the church..." {...register('message')} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  {...register('isAnonymous')}
                  className="w-4 h-4 rounded border-input"
                />
                <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                  Make this donation anonymous
                </Label>
              </div>

              {submitError && <p className="text-sm text-destructive">{submitError}</p>}

              <Button variant="brand" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">🔒 Secured by 256-bit SSL encryption</p>
            </form>
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
  )
}
