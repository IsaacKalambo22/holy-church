import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const eventCardVariants = cva('group hover:shadow-md hover:-translate-y-0.5 transition-all', {
  variants: {
    featured: {
      true: 'border-primary/40 ring-1 ring-primary/20',
      false: '',
    },
  },
  defaultVariants: {
    featured: false,
  },
})

interface EventCardProps extends VariantProps<typeof eventCardVariants> {
  title: string
  date: string
  time?: string
  location?: string
  category?: string
  description?: string
  featured?: boolean
  actions?: ReactNode
  className?: string
}

const categoryColors: Record<string, string> = {
  Convention: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Youth: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Outreach: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Family: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Prayer: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  Children: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
}

export function EventCard({
  title,
  date,
  time,
  location,
  category,
  description,
  featured,
  actions,
  className,
}: EventCardProps) {
  return (
    <Card className={cn(eventCardVariants({ featured }), className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-snug">{title}</CardTitle>
          {category && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${categoryColors[category] || 'bg-muted text-muted-foreground'}`}>
              {category}
            </span>
          )}
          {featured && <Badge variant="brand" className="text-xs">Featured</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            {date}
          </span>
          {time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              {time}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              {location}
            </span>
          )}
        </div>
        {actions && <div className="pt-2">{actions}</div>}
      </CardContent>
    </Card>
  )
}
