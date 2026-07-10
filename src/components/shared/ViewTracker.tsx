'use client'

import { useEffect } from 'react'

/**
 * Fires a one-time, best-effort POST to a view-increment endpoint when the
 * content is shown in a real browser. Deduped per browser session (via
 * sessionStorage) so a refresh or re-render doesn't inflate the count, and so
 * server prefetches/crawlers (which never run this effect) aren't counted.
 * Renders nothing.
 */
export function ViewTracker({ endpoint, dedupeKey }: { endpoint: string; dedupeKey: string }) {
  useEffect(() => {
    const key = `viewed:${dedupeKey}`
    if (sessionStorage.getItem(key)) return
    // Mark before the request so a double-invoke (React strict mode) can't double-count.
    sessionStorage.setItem(key, '1')
    fetch(endpoint, { method: 'POST' }).catch(() => {
      // Failed ping — allow a retry on the next visit.
      sessionStorage.removeItem(key)
    })
  }, [endpoint, dedupeKey])

  return null
}
