import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { KnowledgeEntry } from '../api/types'
import { BookOpen, Search, ArrowRight, Dna, AlertCircle } from 'lucide-react'

export default function KnowledgeHub() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get<KnowledgeEntry[]>('/knowledge', {
          params: query ? { q: query } : undefined,
          signal: controller.signal,
        })
        setEntries(data)
      } catch (err) {
        if (!controller.signal.aborted) setError(extractErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-stone-900/[0.06]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Rare Disease Knowledge Hub
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 border border-indigo-200/60 font-display">
              Clinical Directory
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            A comprehensive, verified medical directory of rare diseases, genetic mechanisms, symptoms, and clinical management.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="mt-6 relative max-w-lg">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by condition name, symptoms, or genetic keywords…"
          className="w-full rounded-full border border-stone-300 bg-white pl-11 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Knowledge Entries */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl border border-stone-200 bg-stone-100" />
          ))}

        {!loading &&
          entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/knowledge-hub/${entry.id}`}
              className="group flex flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-6 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-150 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_48px_-10px_rgba(79,70,229,0.14)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-800 border border-indigo-200/60 font-display">
                    <Dna className="h-3 w-3 text-indigo-600" />
                    {entry.category}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-indigo-800 transition-colors">
                  {entry.name}
                </h2>
                <p className="mt-2 line-clamp-3 text-xs sm:text-sm leading-relaxed text-stone-600">
                  {entry.summary}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1 border-t border-stone-100 pt-3.5 text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform">
                <span>View disease profile</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}

        {!loading && entries.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-stone-300/80 bg-white p-10 text-center">
            <BookOpen className="mx-auto h-9 w-9 text-stone-300" />
            <p className="mt-2 text-sm font-bold text-stone-700 font-display">No condition matches found</p>
            <p className="mt-1 text-xs text-stone-400">Try adjusting your query or searching by a broader symptom term.</p>
          </div>
        )}
      </div>
    </div>
  )
}
