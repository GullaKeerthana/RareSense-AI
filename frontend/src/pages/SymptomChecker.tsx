import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { SymptomCheckResponse } from '../api/types'
import Disclaimer from '../components/Disclaimer'
import {
  Activity,
  Plus,
  X,
  Stethoscope,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle,
  Loader2,
  FileText,
  Building2,
  Compass,
} from 'lucide-react'

const COMMON_SYMPTOM_SUGGESTIONS = [
  'Muscle weakness',
  'Joint hypermobility',
  'Chronic fatigue',
  'Persistent cough',
  'Skin fragility',
  'Frequent infections',
  'Unexplained bruising',
  'Developmental delay',
]

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState<SymptomCheckResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addSymptom = (text?: string) => {
    const candidate = (text !== undefined ? text : draft).trim()
    if (candidate && !symptoms.includes(candidate)) {
      setSymptoms((prev) => [...prev, candidate])
    }
    if (text === undefined) setDraft('')
  }

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addSymptom()
    }
  }

  const removeSymptom = (symptom: string) => {
    setSymptoms((prev) => prev.filter((s) => s !== symptom))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (symptoms.length === 0) {
      setError('Please add at least one symptom to evaluate.')
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post<SymptomCheckResponse>('/symptoms/check', {
        symptoms,
        notes: notes.trim() || undefined,
      })
      setResult(data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-stone-900/[0.06]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Symptom Awareness Guidance
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 border border-indigo-200/60 font-display">
              Differential Match
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Enter observed symptoms to receive educational disease category insights and suggested specialist pathways.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Disclaimer text="This tool offers educational awareness, not a diagnosis. For severe or worsening symptoms, please seek emergency medical care immediately." />
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6 rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-8 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]"
      >
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Symptoms Observed {symptoms.length > 0 && `(${symptoms.length})`}
            </label>
            <span className="text-[11px] text-stone-400">Type and press Enter or comma</span>
          </div>

          {/* Active Symptom Pills */}
          {symptoms.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 rounded-2xl border border-stone-200/60 bg-stone-50/60 p-3.5">
              {symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-900 border border-indigo-200 shadow-2xs animate-in fade-in zoom-in-95 duration-100"
                >
                  <Activity className="h-3 w-3 text-indigo-600" />
                  <span>{symptom}</span>
                  <button
                    type="button"
                    onClick={() => removeSymptom(symptom)}
                    aria-label={`Remove ${symptom}`}
                    className="ml-0.5 rounded-full p-0.5 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-900"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input & Add Button */}
          <div className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleDraftKeyDown}
              placeholder="e.g. persistent chronic cough, extreme joint flexibility…"
              className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={() => addSymptom()}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/[0.08] bg-stone-50 px-5 py-3 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-100 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-4">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Quick Suggestions:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {COMMON_SYMPTOM_SUGGESTIONS.filter((s) => !symptoms.includes(s)).slice(0, 6).map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => addSymptom(sug)}
                  className="rounded-full border border-stone-900/[0.08] bg-white px-3.5 py-1.5 text-[11px] font-medium text-stone-600 hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-800 transition shadow-2xs"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            <FileText className="h-3.5 w-3.5 text-stone-400" />
            <span>Additional Context / Clinical Notes (Optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Onset duration, severity, age of first manifestation, family medical history…"
            className="w-full rounded-2xl border border-stone-300 bg-white p-3.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.3)] transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-[0_14px_30px_-5px_rgba(79,70,229,0.4)] disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing symptom profile…</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Get Educational Guidance & Specialist Match</span>
            </>
          )}
        </button>
      </form>

      {/* Result Presentation */}
      {result && (
        <div className="mt-8 space-y-6 rounded-3xl border border-indigo-200/90 bg-white p-6 sm:p-8 shadow-[0_16px_40px_-8px_rgba(79,70,229,0.12),0_4px_12px_-2px_rgba(15,23,42,0.03)] animate-in fade-in duration-200">
          {/* Top Specialist Highlight Box */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-emerald-50/50 to-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 font-display">
                    Recommended Specialist Pathway
                  </span>
                  <h2 className="font-display text-lg font-bold text-stone-900">{result.suggested_specialist}</h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 transition"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Find {result.suggested_specialist}</span>
                </Link>
                <Link
                  to="/care-navigator"
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/[0.08] bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition shadow-2xs"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Build Care Roadmap</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 font-display">
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>Possible Condition Categories to Discuss</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.possible_categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-800 border border-indigo-200/80 shadow-2xs"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="border-t border-stone-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-display">Clinical Explanation</h3>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-stone-700 bg-stone-50/70 rounded-2xl p-5 border border-stone-900/[0.06]">
              {result.explanation}
            </p>
          </div>

          {/* Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="border-t border-stone-100 pt-5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 font-display">
                <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                <span>Referenced Knowledge Hub Entries</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((source) => (
                  <Link
                    key={source.id}
                    to={`/knowledge-hub/${source.id}`}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-stone-900/[0.08] bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900 transition"
                  >
                    <span>{source.name}</span>
                    <ArrowRight className="h-3 w-3 text-stone-400 group-hover:text-indigo-600" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Disclaimer text={result.disclaimer} />
        </div>
      )}
    </div>
  )
}
