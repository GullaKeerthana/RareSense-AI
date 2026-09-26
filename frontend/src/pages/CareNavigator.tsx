import { useState, type FormEvent, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { CarePlan } from '../api/types'
import Disclaimer from '../components/Disclaimer'
import {
  Compass,
  Stethoscope,
  Building2,
  Landmark,
  Users,
  BookOpen,
  LineChart,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  FileText,
  Milestone,
} from 'lucide-react'

const CATEGORY_META: Record<
  string,
  { icon: ComponentType<{ className?: string }>; label: string; color: string; bg: string; border: string; text: string }
> = {
  specialist: {
    icon: Stethoscope,
    label: 'Medical Specialist',
    color: 'teal',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
  },
  hospital: {
    icon: Building2,
    label: 'Hospital Center',
    color: 'indigo',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
  },
  scheme: {
    icon: Landmark,
    label: 'Financial Scheme',
    color: 'emerald',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
  },
  ngo: {
    icon: Users,
    label: 'Patient Advocacy',
    color: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
  },
  self_care: {
    icon: BookOpen,
    label: 'Management & Self-Care',
    color: 'cyan',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
  },
  tracking: {
    icon: LineChart,
    label: 'Symptom Tracking',
    color: 'amber',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
  },
}

const EXAMPLE_QUERIES = [
  'Frequent chest infections, wheezing, and poor growth in toddler',
  'Joint hypermobility with frequent dislocations and chronic muscle pain',
  'Muscle weakness with difficulty climbing stairs in young child',
]

export default function CareNavigator() {
  const [input, setInput] = useState('')
  const [notes, setNotes] = useState('')
  const [plan, setPlan] = useState<CarePlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setPlan(null)
    try {
      const { data } = await api.post<CarePlan>('/care-navigator/plan', {
        input,
        notes: notes.trim() || undefined,
      })
      setPlan(data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-stone-900/[0.06]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              AI Care Navigator
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 border border-indigo-200/60 font-display">
              Stage Architecture
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Transform ambiguous symptoms or rare disease diagnoses into a step-by-step clinical roadmap.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left Column: Input Configuration Form (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-7 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] space-y-5"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Clinical Scenario or Suspected Condition
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                placeholder="e.g. Frequent lung infections, salty sweat, and digestive problems in 4-year-old child"
                className="w-full rounded-2xl border border-stone-300 bg-stone-50/50 p-3.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />

              {/* Example Prompts */}
              <div className="mt-3 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Quick Clinical Examples:
                </span>
                <div className="space-y-1">
                  {EXAMPLE_QUERIES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setInput(ex)}
                      className="w-full text-left rounded-xl border border-stone-200/80 bg-stone-50/80 px-3 py-1.5 text-[11px] text-stone-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900 transition"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                <FileText className="h-3.5 w-3.5 text-stone-400" />
                <span>Patient Background (Age, Location, Tests)</span>
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 5yo in Bengaluru, initial blood tests normal"
                className="w-full rounded-2xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.3)] transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-[0_14px_30px_-5px_rgba(79,70,229,0.4)] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing care roadmap…</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Personalized Care Roadmap</span>
                </>
              )}
            </button>
          </form>

          {/* Educational Disclaimer */}
          <Disclaimer text="Care roadmaps provide educational navigation, connecting medical specialties and aid policies. Confirm all testing and treatment protocols directly with qualified physicians." />
        </div>

        {/* Right Column: Visual Journey Presentation (7 cols on lg) */}
        <div className="lg:col-span-7">
          {!plan && !loading && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300/80 bg-white p-8 text-center shadow-2xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                <Milestone className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="mt-4 font-display text-base sm:text-lg font-bold text-stone-800">
                Interactive Journey Stage Roadmap
              </h2>
              <p className="mt-1.5 text-xs text-stone-500 max-w-sm leading-relaxed">
                Describe symptoms or a condition on the left to generate an end-to-end clinical timeline with specialist visits, hospital care, financial schemes, and patient support groups.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-2xs">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <h2 className="mt-4 font-display text-sm font-bold text-stone-800">
                Building Your Care Roadmap
              </h2>
              <p className="mt-1 text-xs text-stone-400">
                Synthesizing diagnostic stages, specialized departments, and applicable schemes…
              </p>
            </div>
          )}

          {plan && !loading && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Executive Summary Card */}
              <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/40 p-6 shadow-[0_16px_40px_-8px_rgba(79,70,229,0.1),0_4px_12px_-2px_rgba(15,23,42,0.03)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Personalized Care Plan
                    </span>
                  </div>
                  <span className="rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-[10px] font-bold text-indigo-900 font-display">
                    {plan.steps.length} Milestones
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-800 font-medium">
                  {plan.summary}
                </p>
              </div>

              {/* Multi-Stage Visual Roadmap */}
              <div className="rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-8 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]">
                <div className="flex items-center gap-2 mb-6">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                    STAGE PROGRESSION ROADMAP
                  </span>
                </div>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-600 before:via-emerald-400 before:to-stone-300">
                  {plan.steps.map((step, i) => {
                    const meta = CATEGORY_META[step.category] || {
                      icon: CheckCircle2,
                      label: step.category,
                      color: 'slate',
                      bg: 'bg-stone-50',
                      border: 'border-stone-200',
                      text: 'text-stone-700',
                    }
                    const Icon = meta.icon
                    const stepNum = (i + 1).toString().padStart(2, '0')
                    return (
                      <div key={i} className="relative group">
                        {/* Milestone Indicator Node */}
                        <div className="absolute -left-6 sm:-left-8 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-indigo-300 bg-white shadow-2xs transition-transform group-hover:scale-110">
                          <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-700" />
                        </div>

                        {/* Milestone Card */}
                        <div className="rounded-2xl border border-stone-900/[0.06] bg-stone-50/60 p-4 sm:p-5 transition-all hover:bg-white hover:border-indigo-300 hover:shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 font-display text-[10px] font-bold text-stone-800">
                                {stepNum}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border font-display ${meta.bg} ${meta.border} ${meta.text}`}
                              >
                                {meta.label}
                              </span>
                            </div>
                          </div>

                          <h3 className="mt-2.5 font-display text-sm sm:text-base font-bold text-stone-900">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-600">
                            {step.description}
                          </p>

                          {step.link && (
                            <div className="mt-3.5">
                              <Link
                                to={step.link}
                                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 border border-stone-200 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50 transition"
                              >
                                <span>Access Resource</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
