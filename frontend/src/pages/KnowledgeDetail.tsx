import { useEffect, useState, type ReactNode, type ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { KnowledgeEntry } from '../api/types'
import {
  BookOpen,
  ArrowLeft,
  Dna,
  Activity,
  ShieldCheck,
  Globe,
  ExternalLink,
  Loader2,
  AlertCircle,
  Stethoscope,
  Compass,
} from 'lucide-react'

export default function KnowledgeDetail() {
  const { id } = useParams()
  const [entry, setEntry] = useState<KnowledgeEntry | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get<KnowledgeEntry>(`/knowledge/${id}`)
      .then(({ data }) => setEntry(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-4xl items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span>Loading disease profile…</span>
        </div>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-7 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
          <p className="mt-2 text-sm font-semibold text-rose-800">{error || 'Disease profile not found.'}</p>
          <Link
            to="/knowledge-hub"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Knowledge Hub</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <Link
        to="/knowledge-hub"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-indigo-700 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Knowledge Hub</span>
      </Link>

      <div className="mt-4 rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-9 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800 border border-indigo-200/60 font-display">
            <Dna className="h-3.5 w-3.5 text-indigo-600" />
            {entry.category}
          </span>
        </div>

        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          {entry.name}
        </h1>

        {entry.aliases.length > 0 && (
          <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
            <strong className="font-semibold text-stone-700">Also known as:</strong> {entry.aliases.join(', ')}
          </p>
        )}

        {/* Overview Box */}
        <div className="mt-6 rounded-2xl border border-stone-900/[0.06] bg-stone-50/60 p-5 text-xs sm:text-sm leading-relaxed text-stone-700">
          {entry.summary}
        </div>

        {/* Symptoms */}
        <Section title="Common Clinical Symptoms" icon={Activity}>
          <div className="flex flex-wrap gap-2">
            {entry.symptoms.map((symptom) => (
              <span
                key={symptom}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-800 border border-indigo-200/60 shadow-2xs"
              >
                <Activity className="h-3 w-3 text-indigo-600" />
                <span>{symptom}</span>
              </span>
            ))}
          </div>
        </Section>

        {/* Causes */}
        {entry.causes && (
          <Section title="Etiology & Underlying Causes" icon={Dna}>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 bg-stone-50/40 rounded-2xl p-5 border border-stone-900/[0.06]">
              {entry.causes}
            </p>
          </Section>
        )}

        {/* Management */}
        {entry.management && (
          <Section title="Clinical Management & Therapies" icon={ShieldCheck}>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 bg-stone-50/40 rounded-2xl p-5 border border-stone-900/[0.06]">
              {entry.management}
            </p>
          </Section>
        )}

        {/* Prevalence */}
        {entry.prevalence_note && (
          <Section title="Epidemiology & Prevalence" icon={Globe}>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 bg-stone-50/40 rounded-2xl p-5 border border-stone-900/[0.06]">
              {entry.prevalence_note}
            </p>
          </Section>
        )}

        {/* External Resources */}
        {entry.resources.length > 0 && (
          <Section title="Scientific References & Reading" icon={BookOpen}>
            <ul className="space-y-2">
              {entry.resources.map((resource) => (
                <li
                  key={resource}
                  className="flex items-center gap-2 rounded-2xl border border-stone-900/[0.06] bg-white p-3 text-xs text-stone-700"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span>{resource}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Action Callout */}
        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-emerald-50/40 p-5 sm:p-6">
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-stone-900">Need care navigation for {entry.name}?</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Generate a personalized roadmap or locate medical specialist departments.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/care-navigator"
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 transition"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Build Care Journey</span>
            </Link>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/[0.08] bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition shadow-2xs"
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Find Specialists</span>
            </Link>
          </div>
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
