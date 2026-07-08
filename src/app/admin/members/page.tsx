'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ShieldCheck, User } from 'lucide-react'
import { apiFetch } from '@/lib/api-client'

interface Member {
  id: string
  name: string
  email: string
  role: string
  isVerified: boolean
  createdAt: string
}

export default function AdminMembersPage() {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    async function loadMembers() {
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (roleFilter) params.append('role', roleFilter)

        const response = await apiFetch(`/api/admin/members?${params}`)
        if (response.ok) {
          const result = await response.json()
          setMembers(result.data || [])
        }
      } catch {
        console.error('Failed to load members')
      } finally {
        setLoading(false)
      }
    }
    loadMembers()
  }, [search, roleFilter])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800'
      case 'ADMIN':
        return 'bg-orange-100 text-orange-800'
      case 'PASTOR':
        return 'bg-purple-100 text-purple-800'
      case 'MINISTRY_LEADER':
        return 'bg-blue-100 text-blue-800'
      case 'CONTENT_MANAGER':
        return 'bg-green-100 text-green-800'
      case 'FINANCE_MANAGER':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 px-3 border border-input rounded-lg bg-background text-foreground text-sm"
              >
                <option value="">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="PASTOR">Pastor</option>
                <option value="MINISTRY_LEADER">Ministry Leader</option>
                <option value="CONTENT_MANAGER">Content Manager</option>
                <option value="FINANCE_MANAGER">Finance Manager</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Loading members...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No members found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {member.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                      )}
                      <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                        {member.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
