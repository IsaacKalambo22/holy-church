'use client'

import { useState, useEffect } from 'react'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletterSubscription: true,
    showProfile: true,
    showEmail: false,
    showPhone: false,
  })

  useEffect(() => {
    async function loadPreferences() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(`${baseUrl}/api/member/preferences`)
        if (response.ok) {
          const result = await response.json()
          if (result.data) {
            setPreferences(result.data)
          }
        }
      } catch {
        console.error('Failed to load preferences')
      } finally {
        setLoading(false)
      }
    }
    loadPreferences()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${baseUrl}/api/member/preferences`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })
      if (response.ok) {
        alert('Preferences saved successfully')
      }
    } catch {
      alert('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Settings"
        description="Manage your account preferences and privacy settings"
        badge="Member Settings"
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates from the church</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                  </div>
                  <input
                    id="sms-notifications"
                    type="checkbox"
                    checked={preferences.smsNotifications}
                    onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsletter">Newsletter Subscription</Label>
                    <p className="text-sm text-muted-foreground">Subscribe to our weekly newsletter</p>
                  </div>
                  <input
                    id="newsletter"
                    type="checkbox"
                    checked={preferences.newsletterSubscription}
                    onChange={(e) => setPreferences({ ...preferences, newsletterSubscription: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control what information is visible to other members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-profile">Show Profile</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                  </div>
                  <input
                    id="show-profile"
                    type="checkbox"
                    checked={preferences.showProfile}
                    onChange={(e) => setPreferences({ ...preferences, showProfile: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email">Show Email</Label>
                    <p className="text-sm text-muted-foreground">Display your email to other members</p>
                  </div>
                  <input
                    id="show-email"
                    type="checkbox"
                    checked={preferences.showEmail}
                    onChange={(e) => setPreferences({ ...preferences, showEmail: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-phone">Show Phone</Label>
                    <p className="text-sm text-muted-foreground">Display your phone number to other members</p>
                  </div>
                  <input
                    id="show-phone"
                    type="checkbox"
                    checked={preferences.showPhone}
                    onChange={(e) => setPreferences({ ...preferences, showPhone: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
