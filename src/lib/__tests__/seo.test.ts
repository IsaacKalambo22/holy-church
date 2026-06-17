import { describe, it, expect, beforeEach } from 'vitest'
import { createMetadata, createCanonicalUrl } from '../seo'

describe('SEO Utilities', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://test.holychurch.mw'
  })

  describe('createMetadata', () => {
    it('should create metadata with title and description', () => {
      const metadata = createMetadata({
        title: 'Test Page',
        description: 'Test description',
      })

      expect(metadata.title).toBe('Test Page')
      expect(metadata.description).toBe('Test description')
    })

    it('should include OpenGraph metadata', () => {
      const metadata = createMetadata({
        title: 'Test Page',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
      })

      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBe('Test Page')
      expect(metadata.openGraph?.images).toBeDefined()
    })

    it('should include Twitter Card metadata', () => {
      const metadata = createMetadata({
        title: 'Test Page',
        description: 'Test description',
      })

      expect(metadata.twitter).toBeDefined()
      expect(metadata.twitter?.title).toBe('Test Page')
    })

    it('should set noIndex when specified', () => {
      const metadata = createMetadata({
        title: 'Test Page',
        description: 'Test description',
        noIndex: true,
      })

      expect(metadata.robots).toBeDefined()
      if (typeof metadata.robots === 'object') {
        expect(metadata.robots?.index).toBe(false)
        expect(metadata.robots?.follow).toBe(false)
      }
    })
  })

  describe('createCanonicalUrl', () => {
    it('should create canonical URL with path', () => {
      const url = createCanonicalUrl('/sermons/test-sermon')
      expect(url).toBe('https://test.holychurch.mw/sermons/test-sermon')
    })

    it('should handle root path', () => {
      const url = createCanonicalUrl('/')
      expect(url).toBe('https://test.holychurch.mw/')
    })

    it('should handle paths with query parameters', () => {
      const url = createCanonicalUrl('/sermons?page=2')
      expect(url).toBe('https://test.holychurch.mw/sermons?page=2')
    })
  })
})
