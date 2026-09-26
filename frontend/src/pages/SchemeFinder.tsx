import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { GovernmentScheme } from '../api/types'
import Disclaimer from '../components/Disclaimer'
import {
  Landmark,
  Search,
  ArrowRight,
  Coins,
  AlertCircle,
} from 'lucide-react'

export default function SchemeFinder() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get<GovernmentScheme[]>('/schemes', {
          params: query ? { q: query } : undefined,
          signal: controller.signal,
        })
        setSchemes(data)
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
          <Landmark className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Government Scheme Finder
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800 border border-blue-200/60 font-display">
              Financial Grants
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Discover central, state, and specialized financial assistance schemes for rare disease diagnosis and lifelong therapy.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Disclaimer text="Financial scheme policies, caps, and application portals update periodically. Always verify current criteria via the official ministry link provided on each scheme." />
      </div>

      {/* Search bar */}
      <div className="mt-6 relative max-w-lg">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by scheme name or condition area…"
          className="w-full rounded-full border border-stone-300 bg-white pl-11 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Schemes Grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl border border-stone-200 bg-stone-100" />
          ))}

        {!loading &&
          schemes.map((scheme) => (
            <Link
              key={scheme.id}
              to={`/schemes/${scheme.id}`}
              className="group flex flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-7 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-150 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_48px_-10px_rgba(79,70,229,0.14)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-800 border border-blue-200/60 font-display">
                    <Landmark className="h-3 w-3 text-blue-600" />
                    Government Aid
                  </span>
                </div>

                <h2 className="mt-4 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-indigo-800 transition-colors">
                  {scheme.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                  {scheme.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-200/60 line-clamp-1">
                  <Coins className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{scheme.coverage}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-indigo-700 mt-1">
                  <span>View eligibility & application steps</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}

        {!loading && schemes.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-stone-300/80 bg-white p-10 text-center">
            <Landmark className="mx-auto h-9 w-9 text-stone-300" />
            <p className="mt-2 text-sm font-bold text-stone-700 font-display">No schemes found</p>
            <p className="mt-1 text-xs text-stone-400">Try searching for a different keyword or condition.</p>
          </div>
        )}
      </div>
    </div>
  )
}
