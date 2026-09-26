import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Building2, BookOpen, Landmark, Users, ArrowRight, ShieldCheck } from 'lucide-react'

interface Card {
  to: string
  title: string
  description: string
  icon: typeof Building2
  countKey: string
}

const cards: Card[] = [
  {
    to: '/admin/hospitals',
    title: 'Hospitals',
    description: 'Directory powering Hospital Finder, Doctor Finder, and Emergency SOS.',
    icon: Building2,
    countKey: '/hospitals',
  },
  {
    to: '/admin/knowledge-hub',
    title: 'Knowledge Hub',
    description: 'Disease entries used by the AI Assistant, Symptom Checker, and Care Navigator.',
    icon: BookOpen,
    countKey: '/knowledge',
  },
  {
    to: '/admin/schemes',
    title: 'Government Schemes',
    description: 'Financial assistance schemes shown in the Government Scheme Finder.',
    icon: Landmark,
    countKey: '/schemes',
  },
  {
    to: '/admin/ngos',
    title: 'NGO Directory',
    description: 'Support organizations shown in the NGO Directory.',
    icon: Users,
    countKey: '/ngos',
  },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    cards.forEach((card) => {
      api
        .get<unknown[]>(card.countKey)
        .then(({ data }) => setCounts((c) => ({ ...c, [card.countKey]: data.length })))
        .catch(() => {})
    })
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-stone-900">
            Welcome, {user?.full_name || 'Admin'}
          </h1>
          <p className="text-xs text-stone-500">Manage the data that powers every patient-facing feature.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.to}
              to={card.to}
              className="group flex flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-6 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-150 hover:-translate-y-1 hover:border-indigo-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-display text-2xl font-bold text-stone-300 group-hover:text-indigo-600 transition-colors">
                  {counts[card.countKey] ?? '–'}
                </span>
              </div>
              <div className="mt-4">
                <h2 className="font-display text-sm font-bold text-stone-900">{card.title}</h2>
                <p className="mt-1 text-xs text-stone-500 leading-relaxed">{card.description}</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform">
                Manage
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
