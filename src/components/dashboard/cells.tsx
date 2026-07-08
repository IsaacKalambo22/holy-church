import type { Item } from './ResourceManager'

const toneStyles: Record<string, string> = {
  green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  gray: 'bg-muted text-muted-foreground',
  purple: 'bg-primary/10 text-primary',
}

export function Pill({ text, tone = 'gray' }: { text: string; tone?: keyof typeof toneStyles }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${toneStyles[tone]}`}>
      {text}
    </span>
  )
}

export function fmtDate(value: unknown): string {
  if (!value) return '—'
  const d = new Date(String(value))
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function truncate(value: unknown, n = 60): string {
  const s = value ? String(value) : ''
  if (!s) return '—'
  return s.length > n ? s.slice(0, n) + '…' : s
}

export function publishedPill(item: Item) {
  return item.published ? <Pill text="Published" tone="green" /> : <Pill text="Draft" tone="gray" />
}
