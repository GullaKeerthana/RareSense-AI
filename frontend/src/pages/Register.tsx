import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { extractErrorMessage } from '../api/client'
import type { UserRole } from '../api/types'
import authSide from '../assets/auth-side.webp'
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  HeartHandshake,
  Stethoscope,
  Users,
  Check,
  UserCheck,
} from 'lucide-react'

const roleOptions: {
  value: UserRole
  label: string
  desc: string
  icon: typeof User
}[] = [
  { value: 'patient', label: 'Patient', desc: 'Find answers & care access', icon: UserCheck },
  { value: 'caregiver', label: 'Caregiver', desc: 'Manage family care plan', icon: HeartHandshake },
  { value: 'doctor', label: 'Doctor', desc: 'Clinical reference tool', icon: Stethoscope },
  { value: 'ngo', label: 'NGO', desc: 'Advocacy & outreach hub', icon: Users },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('patient')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(fullName, email, password, role)
      navigate('/assistant')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)]">
      {/* Form Left Side */}
      <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 font-display">Join RareSense AI</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">Create your account</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
            Get personalized AI health navigation, specialist referrals, and financial aid discovery.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Priya Sharma / Alex Mercer"
                  className="w-full rounded-full border border-stone-300 bg-white pl-11 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-full border border-stone-300 bg-white pl-11 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-full border border-stone-300 bg-white pl-11 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = role === option.value
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      className={`group relative flex flex-col items-start rounded-2xl border p-3 text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/90 shadow-2xs ring-1 ring-indigo-600/30'
                          : 'border-stone-900/[0.08] bg-white hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-indigo-700" />}
                      </div>
                      <div className="mt-2 text-xs font-bold text-stone-900 font-display">{option.label}</div>
                      <div className="text-[10px] text-stone-500 line-clamp-1">{option.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.3)] transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-[0_14px_30px_-5px_rgba(79,70,229,0.4)] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating your account…</span>
                </>
              ) : (
                <>
                  <span>Create RareSense Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Hero Visual Right Side */}
      <div className="relative hidden w-[45%] shrink-0 lg:block overflow-hidden bg-stone-900">
        <img src={authSide} alt="Clinical Support" className="h-full w-full object-cover opacity-50 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-indigo-950/70 to-stone-900/50" />

        <div className="absolute inset-x-8 bottom-12 text-white">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md border border-indigo-400/30 font-display">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Inclusive Rare Disease Network</span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
            Personalized intelligence tailored to your care perspective
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
            Whether you are a newly diagnosed individual, an overburdened caregiver, a clinician, or an NGO leader — RareSense is your digital ally.
          </p>
        </div>
      </div>
    </div>
  )
}
