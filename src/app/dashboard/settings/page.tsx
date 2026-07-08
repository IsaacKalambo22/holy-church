'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Save, Check } from 'lucide-react'
import { apiFetch } from '@/lib/api-client'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
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
        const response = await apiFetch(`/api/member/preferences`)
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
    setSaved(false)
    try {
      const response = await apiFetch(`/api/member/preferences`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })
      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      // no-op; keep the form state so the user can retry
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-6 text-sm text-muted-foreground">
        Manage your account preferences and privacy settings.
      </p>

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
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

            <div className="flex items-center justify-end gap-3">
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  Saved
                </span>
              )}
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
    </div>
  )
}
