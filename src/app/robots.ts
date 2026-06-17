import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/member', '/api', '/auth'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/member', '/api', '/auth'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
