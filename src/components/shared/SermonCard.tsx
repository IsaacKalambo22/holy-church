import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Play, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const sermonCardVariants = cva('group overflow-hidden cursor-pointer h-full', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface SermonCardProps extends VariantProps<typeof sermonCardVariants> {
  title: string
  preacher: string
  series?: string
  duration?: string
  date?: string
  thumbnailUrl?: string | null
  gradient?: string
  actions?: ReactNode
  className?: string
}

export function SermonCard({
  title,
  preacher,
  series,
  duration,
  date,
  thumbnailUrl,
  gradient = 'from-purple-500 to-indigo-600',
  actions,
  size,
  className,
}: SermonCardProps) {
  return (
    <Card className={cn(sermonCardVariants({ size }), className)}>
      {/* Thumbnail */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
        </div>
        {series && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-[var(--brand-orange)] border-0 text-white text-xs">{series}</Badge>
          </div>
        )}
      </div>

      <CardContent className="pt-5">
        <h3 className="font-heading font-semibold text-foreground text-lg leading-snug group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3">{preacher}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
          )}
          {date && <span>{date}</span>}
        </div>
        {actions && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  )
}
