// Turns a pasted sermon video link into something we can render.
// Supports YouTube and Vimeo share/watch/embed URLs; anything else
// (e.g. a direct .mp4 URL) is treated as a playable file so older
// uploaded sermons keep working.

export type VideoEmbed =
  | { kind: 'iframe'; src: string; provider: 'youtube' | 'vimeo' }
  | { kind: 'file'; src: string }
  | null

function youTubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, '')
  if (host === 'youtu.be') return url.pathname.slice(1) || null
  if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
    if (url.pathname === '/watch') return url.searchParams.get('v')
    const m = url.pathname.match(/^\/(embed|shorts|v)\/([^/?]+)/)
    if (m) return m[2]
  }
  return null
}

function vimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, '')
  if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
    // https://vimeo.com/123456789  or  /channels/x/123456789
    const m = url.pathname.match(/\/(\d+)(?:$|[/?])/)
    if (m) return m[1]
  }
  if (host === 'player.vimeo.com') {
    const m = url.pathname.match(/\/video\/(\d+)/)
    if (m) return m[1]
  }
  return null
}

// Best-effort poster image derived from a video link, used when no explicit
// thumbnail was uploaded. YouTube exposes a predictable thumbnail URL; Vimeo
// and direct files need an API/none, so we return null for those.
export function getVideoThumbnail(raw?: string | null): string | null {
  if (!raw) return null
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }
  const id = youTubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

export function getVideoEmbed(raw?: string | null): VideoEmbed {
  if (!raw) return null
  const value = raw.trim()
  if (!value) return null

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }

  const yt = youTubeId(url)
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt}`, provider: 'youtube' }

  const vm = vimeoId(url)
  if (vm) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vm}`, provider: 'vimeo' }

  return { kind: 'file', src: value }
}
