import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const albumCardVariants = cva('h-full hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer', {
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

interface AlbumCardProps extends VariantProps<typeof albumCardVariants> {
  name: string
  description?: string | null
  coverImage?: string | null
  mediaCount: number
  actions?: ReactNode
  className?: string
}

export function AlbumCard({
  name,
  description,
  coverImage,
  mediaCount,
  actions,
  size,
  className,
}: AlbumCardProps) {
  return (
    <Card className={cn(albumCardVariants({ size }), className)}>
      {coverImage ? (
        <div className="h-48 rounded-t-xl overflow-hidden">
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-48 rounded-t-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-white/50" />
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="font-heading font-semibold text-foreground leading-snug mb-2">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            {mediaCount} {mediaCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        {actions && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  )
}
