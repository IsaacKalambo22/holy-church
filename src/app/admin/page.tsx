import { redirect } from 'next/navigation'

// The admin landing is the overview/stats page.
export default function AdminPage() {
  redirect('/admin/overview')
}
