import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Image as ImageIcon, Play, FileText, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mediaCardVariants = cva('h-full hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer', {
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

interface MediaCardProps extends VariantProps<typeof mediaCardVariants> {
  title?: string | null
  description?: string | null
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'
  url: string
  thumbnailUrl?: string | null
  createdAt?: string | null
  actions?: ReactNode
  className?: string
}

const typeConfig = {
  IMAGE: { icon: ImageIcon, label: 'Image' },
  VIDEO: { icon: Play, label: 'Video' },
  AUDIO: { icon: Play, label: 'Audio' },
  DOCUMENT: { icon: FileText, label: 'Document' },
}

export function MediaCard({
  title,
  description,
  type,
  url,
  thumbnailUrl,
  createdAt,
  actions,
  size,
  className,
}: MediaCardProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <Card className={cn(mediaCardVariants({ size }), className)}>
      {(type === 'IMAGE' || thumbnailUrl) ? (
        <div className="h-48 rounded-t-xl overflow-hidden">
          <img
            src={thumbnailUrl || url}
            alt={title || 'Media'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-48 rounded-t-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Icon className="w-12 h-12 text-white/50" />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">{config.label}</Badge>
          {createdAt && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        {title && (
          <h3 className="font-heading font-semibold text-foreground leading-snug mb-2 line-clamp-1">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        {actions && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  )
}
