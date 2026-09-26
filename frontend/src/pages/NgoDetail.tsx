import { useEffect, useState, type ReactNode, type ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { NGO } from '../api/types'
import {
  ArrowLeft,
  HeartHandshake,
  Phone,
  ExternalLink,
  Loader2,
  AlertCircle,
  Target,
} from 'lucide-react'

export default function NgoDetail() {
  const { id } = useParams()
  const [ngo, setNgo] = useState<NGO | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get<NGO>(`/ngos/${id}`)
      .then(({ data }) => setNgo(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-4xl items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span>Loading organization details…</span>
        </div>
      </div>
    )
  }

  if (error || !ngo) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-7 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
          <p className="mt-2 text-sm font-semibold text-rose-800">{error || 'Organization not found.'}</p>
          <Link
            to="/ngos"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to NGO Directory</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <Link
        to="/ngos"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-indigo-700 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to NGO Directory</span>
      </Link>

      <div className="mt-4 rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-9 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800 border border-purple-200/60 font-display">
            <HeartHandshake className="h-3.5 w-3.5 text-purple-600" />
            Verified Patient Advocacy Group
          </span>
        </div>

        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          {ngo.name}
        </h1>

        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-stone-700">
          {ngo.description}
        </p>

        {/* Focus Area */}
        <Section title="Disease Focus & Scope" icon={Target}>
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 text-xs sm:text-sm font-semibold text-indigo-950 font-display">
            {ngo.focus_area}
          </div>
        </Section>

        {/* Contact Info */}
        <Section title="Helpline & Contact Information" icon={Phone}>
          <div className="rounded-2xl border border-stone-900/[0.06] bg-stone-50/50 p-5 text-xs sm:text-sm leading-relaxed text-stone-800 font-medium">
            {ngo.contact}
          </div>
        </Section>

        {/* Source URL */}
        {ngo.source_url && (
          <Section title="Official Website & Community Portal" icon={ExternalLink}>
            <a
              href={ngo.source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-900/[0.08] bg-white px-5 py-3 text-xs font-semibold text-indigo-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900 transition"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              <span className="truncate">{ngo.source_url}</span>
            </a>
          </Section>
        )}
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
