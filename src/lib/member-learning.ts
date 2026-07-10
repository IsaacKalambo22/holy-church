import { headers } from 'next/headers'

// Shapes returned by GET /api/member/learning. Kept here so the dashboard and
// the full learning hub share one source of truth.
export interface LearningCourse {
  id: string
  slug: string
  title: string
  description?: string | null
  category?: string | null
  imageUrl?: string | null
  lessonCount?: number
}

export interface LearningSermon {
  id: string
  title: string
  slug?: string | null
  description?: string | null
  thumbnailUrl?: string | null
  date: string
  series?: string | null
  audioUrl?: string | null
  videoUrl?: string | null
}

export interface LearningPodcast {
  id: string
  title: string
  description?: string | null
  thumbnailUrl?: string | null
  audioUrl?: string | null
  videoUrl?: string | null
  duration?: number | null
  publishedAt?: string | null
}

export interface LearningData {
  learningTrack: string | null
  trackCourses: LearningCourse[]
  otherCourses: LearningCourse[]
  latestSermons: LearningSermon[]
  latestPodcasts: LearningPodcast[]
}

// Server-side fetch of the signed-in member's learning data. Mirrors the pattern
// used by the dashboard page (absolute URL from request headers + bearer token).
export async function getLearningData(token: string): Promise<LearningData | null> {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'

  try {
    const res = await fetch(`${protocol}://${host}/api/member/learning`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.success ? (json.data as LearningData) : null
  } catch {
    return null
  }
}
