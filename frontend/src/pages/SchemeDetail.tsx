import { useEffect, useState, type ReactNode, type ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { GovernmentScheme } from '../api/types'
import Disclaimer from '../components/Disclaimer'
import {
  Landmark,
  ArrowLeft,
  Coins,
  CheckCircle2,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react'

export default function SchemeDetail() {
  const { id } = useParams()
  const [scheme, setScheme] = useState<GovernmentScheme | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get<GovernmentScheme>(`/schemes/${id}`)
      .then(({ data }) => setScheme(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-4xl items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span>Loading scheme details…</span>
        </div>
      </div>
    )
  }

  if (error || !scheme) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-7 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
          <p className="mt-2 text-sm font-semibold text-rose-800">{error || 'Scheme details not found.'}</p>
          <Link
            to="/schemes"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Government Schemes</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <Link
        to="/schemes"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-indigo-700 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Government Schemes</span>
      </Link>

      <div className="mt-4 rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-9 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200/60 font-display">
            <Landmark className="h-3.5 w-3.5 text-blue-600" />
            Official Government Assistance
          </span>
        </div>

        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          {scheme.name}
        </h1>

        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-stone-700">
          {scheme.description}
        </p>

        {/* Coverage Box */}
        <Section title="Financial Coverage & Benefits" icon={Coins}>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-xs sm:text-sm font-semibold text-emerald-950 font-display">
            {scheme.coverage}
          </div>
        </Section>

        {/* Eligibility */}
        <Section title="Eligibility Criteria" icon={CheckCircle2}>
          <div className="rounded-2xl border border-stone-900/[0.06] bg-stone-50/50 p-5 text-xs sm:text-sm leading-relaxed text-stone-700">
            {scheme.eligibility}
          </div>
        </Section>

        {/* How to Apply */}
        <Section title="How to Apply & Required Documentation" icon={FileText}>
          <div className="rounded-2xl border border-stone-900/[0.06] bg-stone-50/50 p-5 text-xs sm:text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">
            {scheme.how_to_apply}
          </div>
        </Section>

        {/* Source URL */}
        {scheme.source_url && (
          <Section title="Official Application Portal / Gazette Notification" icon={ExternalLink}>
            <a
              href={scheme.source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-900/[0.08] bg-white px-5 py-3 text-xs font-semibold text-indigo-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900 transition"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              <span className="truncate">{scheme.source_url}</span>
            </a>
          </Section>
        )}

        <div className="mt-9 border-t border-stone-100 pt-6">
          <Disclaimer text="Scheme guidelines, budget allocations, and nodal center lists are determined by official ministries. Please confirm current application paperwork directly on the official portal." />
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: ComponentType<{ className?: string }>
  children: ReactNode
}) {
  return (
    <div className="mt-7 border-t border-stone-100 pt-6">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 font-display">
        {Icon && <Icon className="h-3.5 w-3.5 text-indigo-600" />}
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}
