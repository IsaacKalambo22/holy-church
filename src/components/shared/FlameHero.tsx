import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const flameHeroVariants = cva('relative overflow-hidden gradient-flame text-white', {
  variants: {
    size: {
      sm: 'py-16',
      md: 'py-20',
      lg: 'py-24',
      xl: 'py-32',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'lg',
    align: 'center',
  },
})

interface FlameHeroProps extends VariantProps<typeof flameHeroVariants> {
  title: string
  description?: string
  badge?: string
  actions?: ReactNode
  className?: string
}

export function FlameHero({
  title,
  description,
  badge,
  actions,
  size,
  align,
  className,
}: FlameHeroProps) {
  return (
    <section className={cn(flameHeroVariants({ size, align }), className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--brand-purple)] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-[var(--brand-orange)] rounded-full blur-[100px] opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {badge && (
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-[var(--brand-orange)] rounded-full animate-pulse" />
            {badge}
          </span>
        )}
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
          {title}
        </h1>
        {description && (
          <p className="text-white/75 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10">
            {description}
          </p>
        )}
        {actions && <div className="flex flex-col sm:flex-row gap-4 justify-center">{actions}</div>}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
