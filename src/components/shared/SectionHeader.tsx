import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const sectionHeaderVariants = cva('text-center', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    size: {
      sm: 'mb-8',
      md: 'mb-10',
      lg: 'mb-12',
      xl: 'mb-16',
    },
  },
  defaultVariants: {
    align: 'center',
    size: 'lg',
  },
})

interface SectionHeaderProps extends VariantProps<typeof sectionHeaderVariants> {
  badge?: string
  title: string
  description?: string
  className?: string
  actions?: ReactNode
}

export function SectionHeader({
  badge,
  title,
  description,
  actions,
  align,
  size,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(sectionHeaderVariants({ align, size }), className)}>
      {badge && (
        <span className="text-sm font-semibold text-primary uppercase tracking-widest inline-block mb-3">
          {badge}
        </span>
      )}
      <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {actions && <div className="mt-6">{actions}</div>}
    </div>
  )
}
