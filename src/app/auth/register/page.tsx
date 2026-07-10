'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'
import { LESSON_CATEGORIES } from '@/lib/lesson-categories'

// How each learning track is described to a new member on sign-up.
const TRACK_HINTS: Record<string, string> = {
  Beginners: 'New to faith and exploring',
  'New Believers': 'Recently gave my life to Christ',
  Discipleship: 'Growing deeper as a follower',
  Ministers: 'Serving or training in ministry',
  Leaders: 'Leading a ministry or group',
}

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [learningTrack, setLearningTrack] = useState<string>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, learningTrack: learningTrack || undefined }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Registration failed')
        return
      }

      // Auto-login after registration
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const loginData = await loginRes.json()

      if (loginData.success) {
        login(loginData.data.user)
        // Everyone lands on their dashboard — members get a learning hub, staff
        // get the management console.
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero title="Create Account" description="Join our church family today" />

      <div className="max-w-md mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Banda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={8}
              />
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>What best describes you?</Label>
            <p className="text-xs text-muted-foreground">
              We&apos;ll tailor your dashboard to what you want to learn. You can change this later.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LESSON_CATEGORIES.map((track) => {
                const active = learningTrack === track
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setLearningTrack(active ? '' : track)}
                    className={cn(
                      'rounded-lg border p-3 text-left transition-colors',
                      active
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-input hover:bg-accent'
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{track}</p>
                    <p className="text-xs text-muted-foreground">{TRACK_HINTS[track]}</p>
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setLearningTrack('')}
                className={cn(
                  'rounded-lg border p-3 text-left transition-colors sm:col-span-2',
                  learningTrack === ''
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-input hover:bg-accent'
                )}
              >
                <p className="text-sm font-medium text-foreground">Just exploring</p>
                <p className="text-xs text-muted-foreground">Show me everything — I&apos;ll decide later</p>
              </button>
            </div>
          </div>

          <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
