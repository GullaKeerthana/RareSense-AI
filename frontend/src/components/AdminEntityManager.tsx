import { useEffect, useState } from 'react'
import { api, extractErrorMessage } from '../api/client'
import { Plus, Pencil, Trash2, X, Loader2, Save, ShieldCheck } from 'lucide-react'

export interface AdminField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'list'
  placeholder?: string
}

interface Entity {
  id: string
  [key: string]: unknown
}

type FormState = Record<string, string | boolean>

function toFormState(fields: AdminField[], entity?: Entity): FormState {
  const state: FormState = {}
  for (const field of fields) {
    const raw = entity?.[field.name]
    if (field.type === 'boolean') {
      state[field.name] = Boolean(raw ?? false)
    } else if (field.type === 'list') {
      state[field.name] = Array.isArray(raw) ? raw.join(', ') : ''
    } else {
      state[field.name] = raw != null ? String(raw) : ''
    }
  }
  return state
}

function toPayload(fields: AdminField[], form: FormState): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const field of fields) {
    const value = form[field.name]
    if (field.type === 'boolean') {
      payload[field.name] = Boolean(value)
    } else if (field.type === 'list') {
      payload[field.name] = String(value || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    } else if (field.type === 'number') {
      payload[field.name] = Number(value) || 0
    } else {
      payload[field.name] = value || ''
    }
  }
  return payload
}

export default function AdminEntityManager({
  title,
  description,
  apiPath,
  fields,
  summaryFields,
}: {
  title: string
  description: string
  apiPath: string
  fields: AdminField[]
  summaryFields: string[]
}) {
  const [entries, setEntries] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Entity | 'new' | null>(null)
  const [form, setForm] = useState<FormState>({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    api
      .get<Entity[]>(apiPath)
      .then(({ data }) => setEntries(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [apiPath])

  const openNew = () => {
    setForm(toFormState(fields))
    setEditing('new')
  }

  const openEdit = (entity: Entity) => {
    setForm(toFormState(fields, entity))
    setEditing(entity)
  }

  const closeForm = () => {
    setEditing(null)
    setError(null)
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = toPayload(fields, form)
      if (editing === 'new') {
        await api.post(apiPath, payload)
      } else if (editing) {
        await api.put(`${apiPath}/${editing.id}`, payload)
      }
      closeForm()
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)
    try {
      await api.delete(`${apiPath}/${id}`)
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-stone-900">{title}</h1>
            <p className="text-xs text-stone-500">{description}</p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-700/20 hover:from-indigo-700 hover:to-indigo-800 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>
      )}

      {editing && (
        <div className="mt-5 rounded-3xl border border-indigo-200 bg-indigo-50/40 p-5 sm:p-6 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-stone-900">
              {editing === 'new' ? `Add ${title}` : `Edit ${title}`}
            </h2>
            <button onClick={closeForm} className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={String(form[field.name] ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-stone-300 bg-white p-3 text-xs text-stone-900 shadow-2xs focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                ) : field.type === 'boolean' ? (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, [field.name]: !f[field.name] }))}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      form[field.name]
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-stone-300 bg-white text-stone-500'
                    }`}
                  >
                    {form[field.name] ? 'Yes' : 'No'}
                  </button>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    step={field.type === 'number' ? 'any' : undefined}
                    value={String(form[field.name] ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    placeholder={field.type === 'list' ? (field.placeholder || 'Comma-separated') : field.placeholder}
                    className="w-full rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs text-stone-900 shadow-2xs focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-700/20 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-60 transition-all"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {editing === 'new' ? 'Create' : 'Save changes'}
            </button>
            <button
              onClick={closeForm}
              className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-2.5">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl border border-stone-200 bg-stone-100" />
          ))}

        {!loading && entries.length === 0 && (
          <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-xs text-stone-400">
            No entries yet — click "Add New" to create one.
          </p>
        )}

        {!loading &&
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-stone-900/[0.06] bg-white p-4 shadow-2xs"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-stone-900">{String(entry.name ?? entry.id)}</p>
                <p className="truncate text-xs text-stone-500">
                  {summaryFields
                    .map((f) => entry[f])
                    .filter((v) => v !== undefined && v !== null && v !== '')
                    .join(' · ')}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => openEdit(entry)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition"
                  aria-label={`Edit ${String(entry.name)}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition disabled:opacity-50"
                  aria-label={`Delete ${String(entry.name)}`}
                >
                  {deletingId === entry.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
