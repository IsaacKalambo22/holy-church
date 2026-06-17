import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const testimonialCardVariants = cva('h-full hover:shadow-md hover:-translate-y-0.5 transition-all', {
  variants: {
    variant: {
      default: '',
      compact: 'p-5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface TestimonialCardProps extends VariantProps<typeof testimonialCardVariants> {
  quote: string
  author: string
  role?: string
  avatar?: string | null
  initials?: string
  actions?: ReactNode
  className?: string
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  initials,
  actions,
  variant,
  className,
}: TestimonialCardProps) {
  return (
    <Card className={cn(testimonialCardVariants({ variant }), className)}>
      <CardContent className="p-6 flex flex-col h-full">
        <Quote className="w-8 h-8 text-primary/30 mb-4 flex-shrink-0" />
        <p className="text-foreground/80 leading-relaxed text-sm flex-1 mb-6">
          "{quote}"
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          {avatar ? (
            <img src={avatar} alt={author} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials || author.slice(0, 2).toUpperCase()}</span>
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground text-sm">{author}</p>
            {role && <p className="text-muted-foreground text-xs">{role}</p>}
          </div>
        </div>
        {actions && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  )
}
