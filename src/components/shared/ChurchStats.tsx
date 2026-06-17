import { cva, type VariantProps } from 'class-variance-authority'
import { Users, BookOpen, Heart, Globe, Church, HandHeart } from 'lucide-react'
import { cn } from '@/lib/utils'

const churchStatsVariants = cva('text-center p-8 rounded-2xl border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all group', {
  variants: {
    size: {
      sm: 'p-6',
      md: 'p-8',
      lg: 'p-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface StatItem {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
  description?: string
}

interface ChurchStatsProps extends VariantProps<typeof churchStatsVariants> {
  stats: StatItem[]
  className?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  book: BookOpen,
  heart: Heart,
  globe: Globe,
  church: Church,
  hand: HandHeart,
}

export function ChurchStats({ stats, size, className }: ChurchStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = typeof stat.icon === 'string' ? iconMap[stat.icon] : stat.icon
        if (!Icon) return null

        return (
          <div key={stat.label} className={cn(churchStatsVariants({ size }), className)}>
            <div className="w-14 h-14 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <p className="font-heading text-4xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="font-semibold text-foreground text-sm">{stat.label}</p>
            {stat.description && <p className="text-muted-foreground text-xs mt-1">{stat.description}</p>}
          </div>
        )
      })}
    </div>
  )
}
