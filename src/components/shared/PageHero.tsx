import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const pageHeroVariants = cva('gradient-hero py-20 px-4 text-center', {
  variants: {
    size: {
      sm: 'py-16',
      md: 'py-20',
      lg: 'py-24',
      xl: 'py-32',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface PageHeroProps extends VariantProps<typeof pageHeroVariants> {
  title: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHero({
  title,
  description,
  icon,
  actions,
  size,
  className,
}: PageHeroProps) {
  return (
    <div className={cn(pageHeroVariants({ size }), className)}>
      <div className="max-w-7xl mx-auto">
        {icon && <div className="mb-6 flex justify-center">{icon}</div>}
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        {actions && <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">{actions}</div>}
      </div>
    </div>
  )
}
