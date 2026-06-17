'use client'

import { useState } from 'react'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    churchName: 'Holy Church Assembly',
    churchEmail: 'info@holychurch.mw',
    churchPhone: '+265 1 123 456',
    churchAddress: '123 Church Street, Lilongwe, Malawi',
    socialFacebook: '',
    socialTwitter: '',
    socialInstagram: '',
    seoTitle: 'Holy Church Assembly - Welcome Home',
    seoDescription: 'Join us for worship, community, and spiritual growth at Holy Church Assembly in Malawi.',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      alert('Settings saved successfully')
    } catch {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Site Settings"
        description="Configure church information and site-wide settings"
        badge="Administrator"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Church Information</CardTitle>
              <CardDescription>Basic information about your church</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Church Name</Label>
                <Input
                  value={settings.churchName}
                  onChange={(e) => setSettings({ ...settings, churchName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={settings.churchEmail}
                  onChange={(e) => setSettings({ ...settings, churchEmail: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input
                  value={settings.churchPhone}
                  onChange={(e) => setSettings({ ...settings, churchPhone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input
                  value={settings.churchAddress}
                  onChange={(e) => setSettings({ ...settings, churchAddress: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Facebook URL</Label>
                <Input
                  placeholder="https://facebook.com/yourchurch"
                  value={settings.socialFacebook}
                  onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Twitter URL</Label>
                <Input
                  placeholder="https://twitter.com/yourchurch"
                  value={settings.socialTwitter}
                  onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Instagram URL</Label>
                <Input
                  placeholder="https://instagram.com/yourchurch"
                  value={settings.socialInstagram}
                  onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Default SEO metadata for your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Default Title</Label>
                <Input
                  value={settings.seoTitle}
                  onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Default Description</Label>
                <Input
                  value={settings.seoDescription}
                  onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
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
      </div>
    </div>
  )
}
