import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const blogCardVariants = cva('h-full hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer', {
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

interface BlogCardProps extends VariantProps<typeof blogCardVariants> {
  title: string
  excerpt?: string | null
  thumbnailUrl?: string | null
  category?: string | null
  author?: string | null
  date?: string
  slug: string
  actions?: ReactNode
  className?: string
}

export function BlogCard({
  title,
  excerpt,
  thumbnailUrl,
  category,
  author,
  date,
  actions,
  size,
  className,
}: BlogCardProps) {
  return (
    <Card className={cn(blogCardVariants({ size }), className)}>
      {thumbnailUrl && (
        <div className="h-48 rounded-t-xl overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader className={thumbnailUrl ? 'pt-5 pb-2' : undefined}>
        {category && (
          <Badge variant="outline" className="w-fit mb-2">{category}</Badge>
        )}
        <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          {author && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {author}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
          )}
        </div>
        <span className="text-primary text-sm font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
          Read More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
        {actions && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  )
}
