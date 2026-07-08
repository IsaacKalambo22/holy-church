'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { logoutRequest } from '@/lib/api-client'

export default function LogoutButton() {
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    await logoutRequest()
    logout()
    window.location.href = '/'
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
}
