import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/sermons`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${siteUrl}/events`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/ministries`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${siteUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/prayer`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${siteUrl}/giving`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  const [sermons, events, ministries, blogs] = await Promise.all([
    prisma.sermon.findMany({
      where: { deletedAt: null, published: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.event.findMany({
      where: { deletedAt: null, date: { gte: new Date() } },
      select: { id: true, updatedAt: true },
    }),
    prisma.ministry.findMany({
      where: { deletedAt: null, status: 'ACTIVE' },
      select: { id: true, updatedAt: true },
    }),
    prisma.blog.findMany({
      where: { deletedAt: null, status: 'PUBLISHED' },
      select: { id: true, updatedAt: true },
    }),
  ])

  const sermonPages = sermons.map((sermon) => ({
    url: `${siteUrl}/sermons/${sermon.id}`,
    lastModified: sermon.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const eventPages = events.map((event) => ({
    url: `${siteUrl}/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const ministryPages = ministries.map((ministry) => ({
    url: `${siteUrl}/ministries/${ministry.id}`,
    lastModified: ministry.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const blogPages = blogs.map((blog) => ({
    url: `${siteUrl}/blog/${blog.id}`,
    lastModified: blog.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...sermonPages, ...eventPages, ...ministryPages, ...blogPages]
}
