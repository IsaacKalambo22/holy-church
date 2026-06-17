'use client'

import { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const faqSectionVariants = cva('space-y-4', {
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

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps extends VariantProps<typeof faqSectionVariants> {
  faqs: FAQItem[]
  className?: string
}

export function FAQSection({ faqs, size, className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={cn(faqSectionVariants({ size }), className)}>
      {faqs.map((faq, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-foreground pr-4">{faq.question}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform',
                  openIndex === index && 'rotate-180'
                )}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 pt-0 text-muted-foreground leading-relaxed">
                {faq.answer}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
