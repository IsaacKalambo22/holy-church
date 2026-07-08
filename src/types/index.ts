import type { UserRole } from '@/lib/roles'

export type Role = UserRole

export interface User {
  id: string
  email: string
  name: string
  avatar?: string | null
  role: Role
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Sermon {
  id: string
  title: string
  description?: string | null
  date: Date
  videoUrl?: string | null
  audioUrl?: string | null
  thumbnailUrl?: string | null
  series?: string | null
  preacherId?: string | null
  preacher?: Pick<User, 'id' | 'name' | 'avatar'>
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description?: string | null
  date: Date
  endDate?: Date | null
  location?: string | null
  imageUrl?: string | null
  category?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Ministry {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  leaderId?: string | null
  leader?: Pick<User, 'id' | 'name' | 'avatar'>
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content?: string | null
  excerpt?: string | null
  thumbnailUrl?: string | null
  category?: string | null
  published: boolean
  authorId?: string | null
  author?: Pick<User, 'id' | 'name' | 'avatar'>
  createdAt: Date
  updatedAt: Date
}

export interface PrayerRequest {
  id: string
  request: string
  isAnonymous: boolean
  status: 'PENDING' | 'PRAYED' | 'ANSWERED'
  userId?: string | null
  user?: Pick<User, 'id' | 'name'> | null
  createdAt: Date
}

export interface Donation {
  id: string
  amount: number
  currency: string
  method?: string | null
  message?: string | null
  donorId?: string | null
  donor?: Pick<User, 'id' | 'name'> | null
  createdAt: Date
}

export interface GalleryItem {
  id: string
  title?: string | null
  imageUrl: string
  category?: string | null
  createdAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string | null
  message: string
  createdAt: Date
}

export interface NewsletterSubscriber {
  id: string
  email: string
  createdAt: Date
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
