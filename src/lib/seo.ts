import type { Metadata } from 'next'

const getSiteUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw'
const siteUrl = getSiteUrl()

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Holy Church Assembly',
    template: '%s | Holy Church Assembly',
  },
  description: 'A place of worship, community, and spiritual growth. Join us for inspiring sermons, vibrant community, and life-changing experiences.',
  keywords: ['church', 'worship', 'sermons', 'community', 'faith', 'Malawi', 'prayer'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Holy Church Assembly',
    title: 'Holy Church Assembly',
    description: 'A place of worship, community, and spiritual growth.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holy Church Assembly',
    description: 'A place of worship, community, and spiritual growth.',
  },
}

export function createMetadata(options: {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  return {
    ...defaultMetadata,
    title: options.title,
    description: options.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: options.title,
      description: options.description,
      images: options.image ? [{ url: options.image, width: 1200, height: 630, alt: options.title }] : undefined,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: options.title,
      description: options.description,
      images: options.image ? [options.image] : undefined,
    },
    robots: options.noIndex ? { index: false, follow: false } : undefined,
  }
}

export function createCanonicalUrl(path: string): string {
  return `${getSiteUrl()}${path}`
}
