import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const donationCardVariants = cva('group hover:shadow-md transition-all', {
  variants: {
    variant: {
      default: '',
      compact: 'p-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface DonationCardProps extends VariantProps<typeof donationCardVariants> {
  amount: number
  currency?: string
  donor?: string
  fund?: string
  message?: string
  date?: string
  actions?: ReactNode
  className?: string
}

const fundLabels: Record<string, string> = {
  general: 'General Fund',
  missions: 'Missions Fund',
  building: 'Building Fund',
  youth: 'Youth Ministry',
  outreach: 'Community Outreach',
  children: "Children's Ministry",
}

export function DonationCard({
  amount,
  currency = 'MWK',
  donor,
  fund,
  message,
  date,
  actions,
  variant,
  className,
}: DonationCardProps) {
  return (
    <Card className={cn(donationCardVariants({ variant }), className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          {fund && (
            <Badge variant="outline" className="text-xs">
              {fundLabels[fund] || fund}
            </Badge>
          )}
        </div>

        <p className="font-heading text-2xl font-bold text-foreground mb-1">
          {currency} {amount.toLocaleString()}
        </p>

        {donor && (
          <p className="text-sm text-muted-foreground mb-3">
            {donor}
          </p>
        )}

        {message && (
          <p className="text-sm text-foreground/70 italic leading-relaxed mb-4">
            "{message}"
          </p>
        )}

        {date && (
          <p className="text-xs text-muted-foreground mb-4">{date}</p>
        )}

        {actions && <div className="pt-3 border-t border-border">{actions}</div>}
      </CardContent>
    </Card>
  )
}
