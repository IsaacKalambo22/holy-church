import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const ministryCardVariants = cva('h-full hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer', {
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

interface MinistryCardProps extends VariantProps<typeof ministryCardVariants> {
  name: string
  description: string
  icon?: ReactNode
  leader?: string
  imageUrl?: string | null
  color?: string
  actions?: ReactNode
  className?: string
}

export function MinistryCard({
  name,
  description,
  icon,
  leader,
  imageUrl,
  color = 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
  actions,
  size,
  className,
}: MinistryCardProps) {
  return (
    <Card className={cn(ministryCardVariants({ size }), className)}>
      <CardHeader>
        {icon ? (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        ) : imageUrl ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden mb-3">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : null}
        <CardTitle className="text-lg">{name}</CardTitle>
        {leader && <CardDescription>{leader}</CardDescription>}
      </CardHeader>
      <CardContent>
        <CardDescription className="leading-relaxed mb-4">{description}</CardDescription>
        <span className="text-primary text-sm font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
          Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
        {actions && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  )
}
