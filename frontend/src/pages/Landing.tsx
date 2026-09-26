import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import heroBg from '../assets/hero-bg.webp'
import {
  Bot,
  Activity,
  BookOpen,
  Landmark,
  Users,
  FileText,
  Building2,
  Stethoscope,
  Compass,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  UserCheck,
  Search,
  PhoneCall,
  Navigation,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react'

const audienceRoles = [
  {
    role: 'Patients & Families',
    desc: 'Demystify complex symptoms, discover available financial subsidies, and connect with patient advocacy networks.',
    icon: HeartHandshake,
    badge: 'Patients',
    highlights: ['Plain-language guidance', 'Financial aid lookup', 'Advocacy connections'],
  },
  {
    role: 'Caregivers',
    desc: 'Structured care roadmaps, emergency hospital routing, and clear plain-language medical document explanations.',
    icon: UserCheck,
    badge: 'Caregivers',
    highlights: ['Step-by-step roadmaps', '24×7 Emergency SOS', 'Report summaries'],
  },
  {
    role: 'Medical Doctors',
    desc: 'Fast reference for rare genetic phenotypes, referral centers, and clinical knowledge validation.',
    icon: Stethoscope,
    badge: 'Clinicians',
    highlights: ['Accredited citations', 'Specialist departments', 'Differential insights'],
  },
  {
    role: 'NGOs & Advocates',
    desc: 'Reach patients searching for support groups, share resources, and streamline access to government schemes.',
    icon: Users,
    badge: 'Advocacy',
    highlights: ['Support network outreach', 'Policy navigation', 'Counseling access'],
  },
]

export default function Landing() {
  const { isAuthenticated, user } = useAuth()

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="flex flex-col">
      {/* 1. ASYMMETRIC SPLIT HERO SECTION */}
      <section className="relative overflow-hidden border-b border-stone-900/[0.06] bg-gradient-to-b from-stone-50 via-indigo-50/20 to-stone-50">
        <img
          src={heroBg}
          alt="Healthcare background"
          className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-stone-50" />

        {/* Ambient luminous diffuse glows */}
        <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16 sm:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column: Asymmetric Bold Typography & CTAs */}
            <div className="lg:col-span-7 text-left">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/90 bg-white/95 px-4 py-1.5 text-xs font-semibold text-indigo-900 shadow-2xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
                </span>
                <span className="font-display font-bold">RareSense 2.0</span>
                <span className="text-stone-300">·</span>
                <span className="text-stone-600 font-medium">Explainable Clinical Intelligence</span>
              </div>

              {/* Main Headline with High-Impact Two-Font Contrast */}
              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl sm:leading-[1.1]">
                Precision guidance and access for the{' '}
                <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                  rare disease journey
                </span>
              </h1>

              {/* Editorial Description */}
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-stone-600 max-w-xl">
                Demystify rare conditions with verified medical literature, explore distance-aware hospital routing, decode lab reports, and unlock central and state assistance schemes in seconds.
              </p>

              {/* Action Buttons with Diffuse Aura */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={isAuthenticated ? '/assistant' : '/register'}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.35)] transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-[0_14px_30px_-5px_rgba(79,70,229,0.45)] hover:-translate-y-0.5"
                >
                  <span>{isAuthenticated ? 'Open AI Workspace' : 'Get Started Free'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/knowledge-hub"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-900/[0.08] bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 shadow-2xs backdrop-blur-md transition-all duration-200 hover:bg-stone-50 hover:border-stone-300 hover:text-stone-900 hover:-translate-y-0.5"
                >
                  <Search className="h-4 w-4 text-stone-400" />
                  <span>Browse Knowledge Hub</span>
                </Link>
              </div>

              {/* Mini Feature Tickers */}
              <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-stone-900/[0.06] pt-6 text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>100% Verified Citations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>Multilingual Consultation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>24×7 Helplines & SOS</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Clinical Telemetry Console Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-stone-900/[0.08] bg-white/95 p-6 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.12),0_6px_16px_-2px_rgba(15,23,42,0.04)] backdrop-blur-xl">
                {/* Console Window Top */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-3 w-3 rounded-full bg-rose-400/80" />
                    <div className="flex h-3 w-3 rounded-full bg-amber-400/80" />
                    <div className="flex h-3 w-3 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 font-display text-xs font-bold text-stone-700">
                      CLINICAL INTELLIGENCE
                    </span>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Node
                  </span>
                </div>

                {/* Simulated Conversation & Analysis Cards */}
                <div className="mt-4 space-y-3">
                  {/* User Query Simulation */}
                  <div className="rounded-2xl bg-stone-50 p-3.5 text-xs text-stone-700 border border-stone-100">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900 font-display mb-1">
                      <Bot className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Clinical Query Simulation</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed italic">
                      "Suspected cystic fibrosis in 4yo child with recurrent pulmonary infections and poor growth..."
                    </p>
                  </div>

                  {/* AI Output Card */}
                  <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        Diagnostic Evaluation
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                        High Confidence
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-stone-800 leading-relaxed">
                      Recommend quantitative <strong>sweat chloride test</strong> (≥60 mmol/L threshold) and CFTR genetic mutation panel. Primary referral to Pediatric Pulmonology.
                    </p>
                    
                    {/* Citations Preview */}
                    <div className="mt-3 flex items-center gap-1.5 pt-2.5 border-t border-indigo-200/60 text-[10px] font-medium text-indigo-800">
                      <BookOpen className="h-3 w-3 text-indigo-600" />
                      <span>CFF Consensus Guidelines · OMIM #219700</span>
                    </div>
                  </div>

                  {/* Proximity Hospital Route Card */}
                  <div className="flex items-center justify-between rounded-2xl border border-stone-900/[0.06] bg-white p-3.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                        <Building2 className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 truncate">NIMHANS Genetic Center</div>
                        <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-semibold mt-0.5">
                          <Navigation className="h-3 w-3" />
                          <span>4.2 km away · 12 min drive</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/hospitals"
                      className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-700 hover:bg-indigo-50 hover:text-indigo-900 transition"
                    >
                      Route
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DARK HIGH-CONTRAST STATS & CLINICAL IMPACT MONOLITH */}
      <section className="border-y border-stone-800 bg-[#070b12] py-16 text-white relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20 font-display">
                <Zap className="h-3.5 w-3.5" />
                <span>CLINICAL IMPACT TELEMETRY</span>
              </div>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Bridging the rare disease diagnostic gap
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed">
              Rare conditions take an average of 4.8 years to diagnose in India. RareSense AI collapses this journey into structured, actionable hours.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-indigo-400 tracking-tight">
                7,000+
              </span>
              <h3 className="mt-2 font-display text-sm font-bold text-white">Rare Diseases Indexed</h3>
              <p className="mt-1 text-xs text-stone-400">Verified phenotypes, genetics, and clinical management profiles.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                100%
              </span>
              <h3 className="mt-2 font-display text-sm font-bold text-white">Citation Transparency</h3>
              <p className="mt-1 text-xs text-stone-400">Every response links back to accredited medical references.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-indigo-400 tracking-tight">
                540+
              </span>
              <h3 className="mt-2 font-display text-sm font-bold text-white">Tertiary Care Centers</h3>
              <p className="mt-1 text-xs text-stone-400">Distance-aware ranking and live driving directions across India.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-rose-400 tracking-tight">
                24×7
              </span>
              <h3 className="mt-2 font-display text-sm font-bold text-white">Emergency Dispatch</h3>
              <p className="mt-1 text-xs text-stone-400">One-tap national helplines and nearest casualty hospital locator.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO-MATRIX FEATURE SHOWCASE WITH REAL SIZE VARIATION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="text-left max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-800 border border-indigo-200/80 font-display">
            <span className="font-bold text-indigo-600">01</span>
            <span className="text-stone-300">/</span>
            <span>ECOSYSTEM SUITE</span>
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Engineered for every stage of care navigation
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            From initial symptom awareness to genetic consultations, government aid applications, and emergency routing.
          </p>
        </div>

        {/* Bento Grid with Asymmetric Spans */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* BENTO 1: AI Assistant (FEATURED - Spans 2 Cols) */}
          <Link
            to={isAuthenticated ? '/assistant' : '/register'}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-900/[0.06] bg-gradient-to-br from-white via-white to-indigo-50/40 p-7 sm:p-9 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_48px_-10px_rgba(79,70,229,0.18)] lg:col-span-2"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-indigo-400/10 blur-2xl transition-transform group-hover:scale-125" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                  <Bot className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/80 flex items-center gap-1 font-display">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Conversational AI
                  </span>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600 border border-stone-200/60">
                    Multilingual
                  </span>
                </div>
              </div>

              <h3 className="mt-6 font-display text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-indigo-800 transition-colors">
                AI Health Assistant
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-stone-600 max-w-xl">
                Natural-language clinical consultation explaining rare disease diagnostic pathways, genetic inheritance patterns, and differential considerations backed by peer-reviewed citations.
              </p>

              {/* Sample Prompt Chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-stone-200/80 bg-stone-50/80 px-3.5 py-1.5 text-xs text-stone-700 font-medium">
                  "How is Wilson's Disease diagnosed?"
                </span>
                <span className="rounded-full border border-stone-200/80 bg-stone-50/80 px-3.5 py-1.5 text-xs text-stone-700 font-medium">
                  "Enzyme replacement therapy options"
                </span>
                <span className="rounded-full border border-stone-200/80 bg-stone-50/80 px-3.5 py-1.5 text-xs text-stone-700 font-medium">
                  "Autosomal recessive inheritance"
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-4">
              <span className="text-xs font-semibold text-stone-500">Interactive conversational workspace</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200/60 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <span>Launch Assistant</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          {/* BENTO 2: Emergency SOS (HIGH-CONTRAST URGENT - 1 Col) */}
          <Link
            to="/sos"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-rose-200/90 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/40 p-7 sm:p-9 shadow-[0_16px_40px_-8px_rgba(225,29,72,0.12),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-rose-400 hover:shadow-[0_20px_48px_-10px_rgba(225,29,72,0.22)]"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-rose-400/20 blur-2xl" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 transition-all duration-200 group-hover:bg-rose-600 group-hover:text-white">
                  <ShieldAlert className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-800 border border-rose-200 font-display">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping" />
                  24×7 Urgent
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
                Emergency SOS
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                Instant one-tap national emergency helplines and immediate geolocation lookup for the closest 24×7 emergency hospitals.
              </p>

              <div className="mt-5 rounded-2xl border border-rose-200 bg-white/90 p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 font-display">
                  <PhoneCall className="h-4 w-4" />
                  <span>National Emergency: 112 / 108</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-rose-100 pt-4">
              <span className="text-xs font-semibold text-rose-700">Immediate hospital dispatch</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 group-hover:translate-x-1 transition-transform">
                <span>View SOS Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          {/* BENTO 3: Care Navigator (JOURNEY ROADMAP - Spans 2 Cols) */}
          <Link
            to={isAuthenticated ? '/care-navigator' : '/register'}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-900/[0.06] bg-gradient-to-br from-white via-white to-emerald-50/40 p-7 sm:p-9 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_20px_48px_-10px_rgba(16,185,129,0.18)] lg:col-span-2"
          >
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 transition-all duration-200 group-hover:bg-emerald-600 group-hover:text-white">
                  <Compass className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/60 font-display">
                  Journey Architecture
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                AI Care Navigator
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-stone-600 max-w-xl">
                Generate structured, milestone-by-milestone clinical journey plans connecting specialized tests, hospital care, financial schemes, and patient support networks.
              </p>

              {/* Visual Step Roadmap Preview */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3 text-center">
                  <span className="font-display text-[10px] font-bold text-indigo-700 uppercase">Stage 01</span>
                  <div className="text-xs font-bold text-stone-800 mt-1 truncate">Specialist Consult</div>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3 text-center">
                  <span className="font-display text-[10px] font-bold text-emerald-700 uppercase">Stage 02</span>
                  <div className="text-xs font-bold text-stone-800 mt-1 truncate">Financial Scheme</div>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3 text-center">
                  <span className="font-display text-[10px] font-bold text-purple-700 uppercase">Stage 03</span>
                  <div className="text-xs font-bold text-stone-800 mt-1 truncate">Patient Advocacy</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-4">
              <span className="text-xs font-semibold text-stone-500">End-to-end diagnostic roadmap</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <span>Build Care Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          {/* BENTO 4: Hospital Finder (1 Col) */}
          <Link
            to="/hospitals"
            className="group relative flex flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-7 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_48px_-10px_rgba(79,70,229,0.14)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600 border border-stone-200/60 flex items-center gap-1">
                  <Navigation className="h-3 w-3 text-indigo-600" />
                  Live Route
                </span>
              </div>
              <h3 className="mt-5 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-indigo-800 transition-colors">
                Hospital Finder
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                Tertiary care centers and rare disease clinics with distance-aware ranking, ratings, and live driving routes.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform border-t border-stone-100 pt-3">
              <span>Find nearby hospitals</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* BENTO 5: Medical Report Analyzer (1 Col) */}
          <Link
            to={isAuthenticated ? '/reports' : '/register'}
            className="group relative flex flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-7 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_20px_48px_-10px_rgba(245,158,11,0.14)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600 border border-stone-200/60">
                  AI OCR
                </span>
              </div>
              <h3 className="mt-5 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                Report Analyzer
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                Upload lab reports or clinical notes to extract clear, plain-language summaries of complex biomarker findings.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform border-t border-stone-100 pt-3">
              <span>Analyze lab reports</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* BENTO 6: Symptom Awareness Guidance (1 Col) */}
          <Link
            to={isAuthenticated ? '/symptom-checker' : '/register'}
            className="group relative flex flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-7 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_48px_-10px_rgba(79,70,229,0.14)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600 border border-stone-200/60">
                  Guidance
                </span>
              </div>
              <h3 className="mt-5 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-indigo-800 transition-colors">
                Symptom Awareness
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                Educational, non-diagnostic guidance analyzing symptom clusters to suggest relevant medical specialties.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform border-t border-stone-100 pt-3">
              <span>Evaluate symptoms</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* BENTO 7: Government Schemes & Aid (1 Col) */}
          <Link
            to="/schemes"
            className="group relative flex flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-7 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_20px_48px_-10px_rgba(59,130,246,0.14)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/80 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Landmark className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600 border border-stone-200/60">
                  Financial Aid
                </span>
              </div>
              <h3 className="mt-5 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-blue-800 transition-colors">
                Govt Scheme Finder
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                Central and state financial assistance policies for rare diseases, eligibility criteria, and step-by-step application guides.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform border-t border-stone-100 pt-3">
              <span>Explore aid schemes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

        </div>
      </section>

      {/* 4. CARE CIRCLE PERSPECTIVES SECTION */}
      <section className="border-t border-stone-900/[0.06] bg-gradient-to-b from-stone-100/60 via-stone-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-800 border border-indigo-200/80 font-display">
              <span className="font-bold text-indigo-600">02</span>
              <span className="text-stone-300">/</span>
              <span>INCLUSIVE DESIGN</span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              Built for every role in the care circle
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
              Rare diseases require collaborative support. RareSense is configured to serve each perspective with clarity.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audienceRoles.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.role}
                  className="flex flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-7 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60 font-display">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-stone-900">{item.role}</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">{item.desc}</p>
                  </div>

                  <div className="mt-6 space-y-2 border-t border-stone-100 pt-4">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                        <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. MONUMENTAL DARK CLOSING CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061e1c] via-[#093532] to-[#042422] p-8 sm:p-16 text-white shadow-2xl shadow-indigo-950/30 border border-indigo-600/30">
          {/* Luminous diffuse aura circles */}
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-200 backdrop-blur-md border border-white/20 font-display">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              Empowering 70+ Million Patients in India
            </span>
            <h2 className="mt-6 font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Begin your rare disease care journey with confidence
            </h2>
            <p className="mt-4 text-sm sm:text-base text-indigo-100 leading-relaxed">
              Join patients, caregivers, clinicians, and advocacy groups leveraging AI-assisted guidance, hospital routing, and verified medical intelligence.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to={isAuthenticated ? '/assistant' : '/register'}
                className="rounded-full bg-white px-8 py-4 text-sm font-bold text-indigo-950 shadow-xl transition-all hover:bg-indigo-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                {isAuthenticated ? 'Open AI Assistant' : 'Create Free Account'}
              </Link>
              <Link
                to="/sos"
                className="rounded-full border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Emergency Helplines
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
