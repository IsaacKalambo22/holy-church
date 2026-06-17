'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const prayerSchema = z.object({
  title: z.string().optional(),
  request: z.string().min(10, 'Please describe your prayer request (at least 10 characters)'),
  category: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  isPublic: z.boolean().default(false),
})

type PrayerFormData = z.infer<typeof prayerSchema>

interface PrayerRequestFormProps {
  onSuccess?: () => void
}

const categories = ['Healing', 'Family', 'Spiritual Growth', 'Financial', 'Guidance', 'Thanksgiving', 'Other']

export function PrayerRequestForm({ onSuccess }: PrayerRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PrayerFormData>({
    resolver: zodResolver(prayerSchema),
    defaultValues: {
      isAnonymous: false,
      isPublic: false,
    },
  })

  const onSubmit = async (data: PrayerFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch(`/api/prayer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Prayer request submission failed')
      }

      setSubmitSuccess(true)
      reset()
      onSuccess?.()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Prayer request submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-6 text-center">
          <p className="text-green-800 dark:text-green-300 font-semibold mb-2">Prayer Request Submitted!</p>
          <p className="text-sm text-green-700 dark:text-green-400">Our prayer team will be praying for you within 24 hours.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prayer Request Form</CardTitle>
        <CardDescription>Our team will pray for you within 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Subject (Optional)</Label>
            <Input
              id="title"
              placeholder="Brief subject line"
              {...register('title')}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <select
              id="category"
              className="w-full h-10 px-3 border border-input rounded-lg bg-background text-sm"
              {...register('category')}
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="request">Prayer Request *</Label>
            <Textarea
              id="request"
              rows={5}
              placeholder="How can we pray for you?"
              {...register('request')}
              disabled={isSubmitting}
            />
            {errors.request && (
              <p className="text-sm text-destructive">{errors.request.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              className="w-4 h-4"
              {...register('isAnonymous')}
              disabled={isSubmitting}
            />
            <Label htmlFor="anonymous" className="text-sm">Keep this request anonymous</Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="public"
              className="w-4 h-4"
              {...register('isPublic')}
              disabled={isSubmitting}
            />
            <Label htmlFor="public" className="text-sm">Allow this request to be shared publicly (name hidden)</Label>
          </div>

          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}

          <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
