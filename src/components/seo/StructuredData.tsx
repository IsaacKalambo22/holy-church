interface StructuredDataProps {
  data: Record<string, unknown>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Holy Church Assembly',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw'}/logo.png`,
    description: 'A place of worship, community, and spiritual growth.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lilongwe',
      addressCountry: 'MW',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+265 1 123 456',
      contactType: 'customer service',
    },
    sameAs: [
      'https://facebook.com/holychurch.mw',
      'https://twitter.com/holychurch',
      'https://instagram.com/holychurch',
    ],
  }
}

export function createChurchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: 'Holy Church Assembly',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw',
    description: 'A place of worship, community, and spiritual growth.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lilongwe',
      addressCountry: 'MW',
    },
  }
}

export function createEventSchema(event: {
  name: string
  description: string
  startDate: string
  location: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lilongwe',
        addressCountry: 'MW',
      },
    },
    url: event.url,
  }
}

export function createArticleSchema(article: {
  title: string
  description: string
  url: string
  datePublished: string
  author?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    author: article.author ? { '@type': 'Person', name: article.author } : undefined,
    image: article.image,
    publisher: {
      '@type': 'Organization',
      name: 'Holy Church Assembly',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://holychurch.mw'}/logo.png`,
      },
    },
  }
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
