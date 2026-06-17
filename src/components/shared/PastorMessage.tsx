import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const pastorMessageVariants = cva('rounded-3xl overflow-hidden', {
  variants: {
    variant: {
      default: 'bg-card border border-border',
      gradient: 'gradient-hero text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface PastorMessageProps extends VariantProps<typeof pastorMessageVariants> {
  name: string
  role: string
  message: string
  imageUrl?: string | null
  signature?: string
  className?: string
}

export function PastorMessage({
  name,
  role,
  message,
  imageUrl,
  signature,
  variant,
  className,
}: PastorMessageProps) {
  const isGradient = variant === 'gradient'

  return (
    <Card className={cn(pastorMessageVariants({ variant }), className)}>
      <CardContent className="p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          {imageUrl && (
            <div className="order-2 md:order-1">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div className={cn('order-1 md:order-2', imageUrl && 'md:pl-4')}>
            <span className={cn(
              'text-sm font-semibold uppercase tracking-widest inline-block mb-4',
              isGradient ? 'text-[var(--brand-orange)]' : 'text-primary'
            )}>
              Welcome from Our Pastor
            </span>
            <h3 className="font-heading text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {name}
            </h3>
            <p className={cn(
              'text-sm font-medium mb-6',
              isGradient ? 'text-white/80' : 'text-muted-foreground'
            )}>
              {role}
            </p>
            <p className={cn(
              'text-lg leading-relaxed mb-6',
              isGradient ? 'text-white/90' : 'text-foreground'
            )}>
              {message}
            </p>
            {signature && (
              <p className={cn(
                'font-heading italic text-lg',
                isGradient ? 'text-white/70' : 'text-muted-foreground'
              )}>
                — {signature}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
