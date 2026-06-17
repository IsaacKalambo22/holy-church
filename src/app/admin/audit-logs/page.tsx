'use client'

import { useState, useEffect } from 'react'
import { FlameHero } from '@/components/shared/FlameHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Shield } from 'lucide-react'
import Link from 'next/link'

interface AuditLog {
  id: string
  action: string
  entity: string | null
  entityId: string | null
  metadata: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
  actor: {
    id: string
    name: string
    email: string
  }
}

export default function AdminAuditLogsPage() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  useEffect(() => {
    async function loadLogs() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (actionFilter) params.append('action', actionFilter)

        const response = await fetch(`${baseUrl}/api/admin/audit-logs?${params}`)
        if (response.ok) {
          const result = await response.json()
          setLogs(result.data || [])
        }
      } catch {
        console.error('Failed to load audit logs')
      } finally {
        setLoading(false)
      }
    }
    loadLogs()
  }, [search, actionFilter])

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-100 text-green-800'
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800'
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-background">
      <FlameHero
        title="Audit Logs"
        description="Track all administrative actions and system events"
        badge="Administrator"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="h-10 px-3 border border-input rounded-lg bg-background text-foreground text-sm"
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="UPDATE_ROLE">Role Changes</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Loading audit logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No audit logs found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 border border-border rounded-lg hover:bg-accent transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-primary" />
                        <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                        {log.entity && (
                          <span className="text-sm text-muted-foreground">
                            {log.entity}
                            {log.entityId && ` (${log.entityId.slice(0, 8)}...)`}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Actor:</span>
                      <span className="font-medium">{log.actor.name}</span>
                      <span className="text-muted-foreground">({log.actor.email})</span>
                    </div>
                    {log.ipAddress && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>IP:</span>
                        <span>{log.ipAddress}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
