import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      const condition = false
      expect(cn('foo', condition && 'bar', 'baz')).toBe('foo baz')
    })

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
    })

    it('should handle empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar')
    })

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
    })

    it('should handle objects with conditional classes', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })
  })
})
