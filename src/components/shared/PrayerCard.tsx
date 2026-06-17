import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { MessageSquare, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const prayerCardVariants = cva('group hover:shadow-md transition-all', {
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

interface PrayerCardProps extends VariantProps<typeof prayerCardVariants> {
  request: string
  author?: string
  date?: string
  isAnonymous?: boolean
  status?: 'PENDING' | 'PRAYED' | 'ANSWERED'
  actions?: ReactNode
  className?: string
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  PRAYED: { label: 'Prayed For', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  ANSWERED: { label: 'Answered', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
}

export function PrayerCard({
  request,
  author,
  date,
  isAnonymous = false,
  status = 'PENDING',
  actions,
  variant,
  className,
}: PrayerCardProps) {
  const config = statusConfig[status]

  return (
    <Card className={cn(prayerCardVariants({ variant }), className)}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground/80 leading-relaxed text-sm">{request}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            {isAnonymous ? (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                Anonymous
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">{author}</span>
            )}
            {date && <span className="text-xs text-muted-foreground">· {date}</span>}
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
            {config.label}
          </span>
        </div>

        {actions && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  )
}
