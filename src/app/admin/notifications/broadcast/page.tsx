'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Send, Users } from 'lucide-react'
import { apiFetch } from '@/lib/api-client'

export default function AdminBroadcastPage() {
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'ANNOUNCEMENT',
    channel: 'IN_APP',
    targetRoles: [] as string[],
  })

  const roleOptions = [
    { value: 'MEMBER', label: 'Members' },
    { value: 'ADMIN', label: 'Admins' },
    { value: 'PASTOR', label: 'Pastors' },
    { value: 'MINISTRY_LEADER', label: 'Ministry Leaders' },
    { value: 'CONTENT_MANAGER', label: 'Content Managers' },
    { value: 'FINANCE_MANAGER', label: 'Finance Managers' },
  ]

  const toggleRole = (role: string) => {
    setFormData({
      ...formData,
      targetRoles: formData.targetRoles.includes(role)
        ? formData.targetRoles.filter((r) => r !== role)
        : [...formData.targetRoles, role],
    })
  }

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      alert('Please fill in all required fields')
      return
    }

    setSending(true)
    try {
      const response = await apiFetch(`/api/notifications/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Broadcast sent to ${result.data.sent} recipients`)
        setFormData({ title: '', message: '', type: 'ANNOUNCEMENT', channel: 'IN_APP', targetRoles: [] })
      } else {
        alert('Failed to send broadcast')
      }
    } catch {
      alert('Failed to send broadcast')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
          <CardHeader>
            <CardTitle>Create Broadcast</CardTitle>
            <CardDescription>Send a notification to selected church members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                placeholder="Enter notification title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Message *</Label>
              <Textarea
                placeholder="Enter your message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="h-10 px-3 border border-input rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="SYSTEM">System</option>
                  <option value="EVENT">Event</option>
                  <option value="SERMON">Sermon</option>
                  <option value="PRAYER">Prayer</option>
                  <option value="DONATION">Donation</option>
                  <option value="BLOG">Blog</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Channel</Label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="h-10 px-3 border border-input rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="IN_APP">In-App</option>
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="PUSH">Push</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Target Roles
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Leave empty to send to all members
              </p>
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleRole(option.value)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                      formData.targetRoles.includes(option.value)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-accent'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSend} disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Sending...' : 'Send Broadcast'}
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
