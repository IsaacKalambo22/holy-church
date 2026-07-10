'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2, X, Loader2, Inbox, Upload, Film } from 'lucide-react'
import { getVideoEmbed } from '@/lib/video'

export type Item = Record<string, unknown>

export interface Field {
  name: string
  label: string
  type?:
    | 'text'
    | 'textarea'
    | 'number'
    | 'checkbox'
    | 'date'
    | 'select'
    | 'stringlist'
    | 'image'
    | 'video'
    | 'videourl'
    | 'audio'
    | 'imagelist'
  options?: { value: string; label: string }[]
  required?: boolean
  placeholder?: string
  help?: string
}

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await apiFetch('/api/upload', { method: 'POST', body: fd })
  const json = await res.json().catch(() => ({ success: false }))
  if (!res.ok || !json.success) throw new Error(json.error || 'Upload failed')
  return json.data.url as string
}

const acceptFor = (type?: string) =>
  type === 'video' ? 'video/*' : type === 'audio' ? 'audio/*' : 'image/*'

function FileField({
  type,
  value,
  onChange,
}: {
  type: 'image' | 'video' | 'audio'
  value: string
  onChange: (url: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const handle = async (file?: File) => {
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      onChange(await uploadFile(file))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      {value && type === 'image' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="h-28 w-full rounded-lg border border-border object-cover" />
      )}
      {value && type !== 'image' && (
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
          <Film className="h-4 w-4" />
          <a href={value} target="_blank" rel="noreferrer" className="truncate text-primary hover:underline">
            {value.split('/').pop()}
          </a>
        </div>
      )}
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? 'Uploading…' : value ? 'Replace' : `Upload ${type}`}
          <input
            type="file"
            accept={acceptFor(type)}
            className="hidden"
            disabled={busy}
            onChange={(e) => handle(e.target.files?.[0])}
          />
        </label>
        {value && !busy && (
          <button type="button" onClick={() => onChange('')} className="text-sm text-muted-foreground hover:text-destructive">
            Remove
          </button>
        )}
      </div>
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  )
}

function VideoUrlField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (url: string) => void
  placeholder?: string
}) {
  const embed = getVideoEmbed(value)
  const trimmed = value.trim()
  const invalid = trimmed !== '' && !embed

  return (
    <div className="space-y-2">
      <Input
        type="url"
        inputMode="url"
        value={value}
        placeholder={placeholder || 'https://youtube.com/watch?v=… or https://vimeo.com/…'}
        onChange={(e) => onChange(e.target.value)}
      />
      {embed?.kind === 'iframe' && (
        <div className="aspect-video overflow-hidden rounded-lg border border-border">
          <iframe
            src={embed.src}
            className="h-full w-full"
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Video preview"
          />
        </div>
      )}
      {embed?.kind === 'file' && (
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground">
          <Film className="h-4 w-4" />
          <span>Direct video file link — will play inline.</span>
        </div>
      )}
      {invalid && (
        <p className="text-xs text-destructive">
          Enter a valid YouTube or Vimeo link (or a direct video file URL).
        </p>
      )}
    </div>
  )
}

function MultiImageField({
  value,
  onChange,
}: {
  value: string[]
  onChange: (urls: string[]) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const handle = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setBusy(true)
    setErr('')
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadFile(f)))
      onChange([...value, ...urls])
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url, i) => (
            <div key={url + i} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-20 w-full rounded-lg border border-border object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {busy ? 'Uploading…' : 'Add images'}
        <input type="file" accept="image/*" multiple className="hidden" disabled={busy} onChange={(e) => handle(e.target.files)} />
      </label>
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  )
}

export interface Column {
  key: string
  label: string
  render?: (item: Item) => React.ReactNode
}

interface Props {
  /** API base, e.g. "/api/sermons" */
  endpoint: string
  /** Singular noun, e.g. "Sermon" */
  title: string
  description?: string
  columns: Column[]
  fields: Field[]
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
  idField?: string
}

function toDateInput(value: unknown): string {
  if (!value) return ''
  const d = new Date(String(value))
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

export function ResourceManager({
  endpoint,
  title,
  description,
  columns,
  fields,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  idField = 'id',
}: Props) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch(`${endpoint}?limit=100`)
      const json = await res.json()
      if (json.success) setItems(json.data || [])
      else setError(json.error || 'Failed to load')
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    const initial: Record<string, unknown> = {}
    fields.forEach((f) => {
      initial[f.name] = f.type === 'checkbox' ? false : f.type === 'imagelist' ? [] : ''
    })
    setForm(initial)
    setEditing(null)
    setFormError('')
    setDialogOpen(true)
  }

  const openEdit = (item: Item) => {
    const initial: Record<string, unknown> = {}
    fields.forEach((f) => {
      const v = item[f.name]
      if (f.type === 'checkbox') initial[f.name] = Boolean(v)
      else if (f.type === 'date') initial[f.name] = toDateInput(v)
      else if (f.type === 'stringlist') initial[f.name] = Array.isArray(v) ? v.join('\n') : ''
      else if (f.type === 'imagelist') initial[f.name] = Array.isArray(v) ? v : []
      else initial[f.name] = v ?? ''
    })
    setForm(initial)
    setEditing(item)
    setFormError('')
    setDialogOpen(true)
  }

  const submit = async () => {
    // required check
    for (const f of fields) {
      if (f.required) {
        const v = form[f.name]
        if (v === '' || v === undefined || v === null || (Array.isArray(v) && v.length === 0)) {
          setFormError(`${f.label} is required`)
          return
        }
      }
    }

    const payload: Record<string, unknown> = {}
    for (const f of fields) {
      let v = form[f.name]
      if (f.type === 'number') {
        if (v === '' || v === null || v === undefined) v = undefined
        else v = Number(v)
      } else if (f.type === 'checkbox') {
        v = Boolean(v)
      } else if (f.type === 'stringlist') {
        v = String(v || '')
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean)
      } else if (f.type === 'imagelist') {
        v = Array.isArray(v) ? v : []
      }
      // Skip empty optional strings so we don't overwrite with ""
      if (!f.required && (v === '' || v === undefined)) continue
      payload[f.name] = v
    }

    setSaving(true)
    setFormError('')
    try {
      const url = editing ? `${endpoint}/${editing[idField]}` : endpoint
      const res = await apiFetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setFormError(json.error || json.details || 'Save failed')
        return
      }
      setDialogOpen(false)
      await load()
    } catch {
      setFormError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item: Item) => {
    if (!confirm(`Delete this ${title.toLowerCase()}? This cannot be undone.`)) return
    try {
      const res = await apiFetch(`${endpoint}/${item[idField]}`, { method: 'DELETE' })
      const json = await res.json().catch(() => ({ success: res.ok }))
      if (res.ok && json.success !== false) await load()
      else alert(json.error || 'Delete failed')
    } catch {
      alert('Delete failed')
    }
  }

  const showActions = canEdit || canDelete

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {description || `Manage ${title.toLowerCase()} records.`}
            {!loading && !error && ` (${items.length})`}
          </p>
        </div>
        {canCreate && (
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New {title}
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-destructive">{error}</div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="font-medium text-foreground">No {title.toLowerCase()} records yet</p>
              {canCreate && (
                <Button onClick={openCreate} variant="outline" size="sm" className="mt-1">
                  <Plus className="mr-2 h-4 w-4" /> Add the first one
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    {columns.map((c) => (
                      <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                        {c.label}
                      </th>
                    ))}
                    {showActions && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={String(item[idField] ?? i)} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                      {columns.map((c) => (
                        <td key={c.key} className="px-4 py-3 align-middle">
                          {c.render ? c.render(item) : renderValue(item[c.key])}
                        </td>
                      ))}
                      {showActions && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {canEdit && (
                              <button
                                onClick={() => openEdit(item)}
                                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                                aria-label="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => remove(item)}
                                className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                                aria-label="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
          <div className="my-8 w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {editing ? `Edit ${title}` : `New ${title}`}
              </h2>
              <button
                onClick={() => setDialogOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5 py-4">
              {formError && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</div>
              )}
              {fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  {f.type !== 'checkbox' && (
                    <Label htmlFor={f.name}>
                      {f.label} {f.required && <span className="text-destructive">*</span>}
                    </Label>
                  )}
                  {f.type === 'textarea' ? (
                    <textarea
                      id={f.name}
                      value={String(form[f.name] ?? '')}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                      className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : f.type === 'stringlist' ? (
                    <textarea
                      id={f.name}
                      value={String(form[f.name] ?? '')}
                      placeholder={f.placeholder || 'One URL per line'}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                      className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      id={f.name}
                      value={String(form[f.name] ?? '')}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select…</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        id={f.name}
                        type="checkbox"
                        checked={Boolean(form[f.name])}
                        onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.checked }))}
                        className="h-4 w-4 rounded"
                      />
                      <span className="text-sm text-foreground">{f.label}</span>
                    </label>
                  ) : f.type === 'image' || f.type === 'video' || f.type === 'audio' ? (
                    <FileField
                      type={f.type}
                      value={String(form[f.name] ?? '')}
                      onChange={(url) => setForm((s) => ({ ...s, [f.name]: url }))}
                    />
                  ) : f.type === 'videourl' ? (
                    <VideoUrlField
                      value={String(form[f.name] ?? '')}
                      placeholder={f.placeholder}
                      onChange={(url) => setForm((s) => ({ ...s, [f.name]: url }))}
                    />
                  ) : f.type === 'imagelist' ? (
                    <MultiImageField
                      value={Array.isArray(form[f.name]) ? (form[f.name] as string[]) : []}
                      onChange={(urls) => setForm((s) => ({ ...s, [f.name]: urls }))}
                    />
                  ) : (
                    <Input
                      id={f.name}
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      value={String(form[f.name] ?? '')}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    />
                  )}
                  {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={submit} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? 'Save Changes' : `Create ${title}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === '') return <span className="text-muted-foreground">—</span>
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}
