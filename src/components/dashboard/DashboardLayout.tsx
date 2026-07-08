'use client'

import { ReactNode } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <DashboardHeader title={title} subtitle={subtitle} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
