import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Menu,
  ShieldAlert,
  User,
} from 'lucide-react'

interface TopHeaderProps {
  onOpenMobile: () => void
}

const pageTitles: Record<string, { title: string; category: string }> = {
  '/assistant': { title: 'AI Health Assistant', category: 'AI Intelligence' },
  '/symptom-checker': { title: 'Symptom Awareness Guidance', category: 'AI Intelligence' },
  '/care-navigator': { title: 'AI Care Navigator', category: 'AI Intelligence' },
  '/hospitals': { title: 'Hospital Finder & Live Route', category: 'Find Care' },
  '/doctors': { title: 'Doctor & Specialist Finder', category: 'Find Care' },
  '/reports': { title: 'Medical Report Analyzer', category: 'Find Care' },
  '/knowledge-hub': { title: 'Rare Disease Knowledge Hub', category: 'Knowledge & Policy' },
  '/schemes': { title: 'Government Scheme Finder', category: 'Knowledge & Policy' },
  '/ngos': { title: 'NGO & Advocacy Directory', category: 'Knowledge & Policy' },
  '/sos': { title: 'Emergency SOS & Helplines', category: 'Crisis Response' },
  '/admin': { title: 'Admin Overview', category: 'Admin Console' },
  '/admin/hospitals': { title: 'Manage Hospitals', category: 'Admin Console' },
  '/admin/knowledge-hub': { title: 'Manage Knowledge Hub', category: 'Admin Console' },
  '/admin/schemes': { title: 'Manage Schemes', category: 'Admin Console' },
  '/admin/ngos': { title: 'Manage NGOs', category: 'Admin Console' },
}

export default function TopHeader({ onOpenMobile }: TopHeaderProps) {
  const { user } = useAuth()
  const location = useLocation()

  // Prefer an exact match (e.g. /admin/hospitals) before falling back to a
  // prefix match for dynamic detail routes (e.g. /hospitals/:id) — otherwise
  // a short entry like /admin would shadow its own more specific sub-routes.
  const currentPath =
    Object.keys(pageTitles).find((path) => location.pathname === path) ??
    Object.keys(pageTitles).find(
      (path) => path !== '/' && location.pathname.startsWith(`${path}/`),
    )
  const meta = currentPath ? pageTitles[currentPath] : { title: 'Workspace', category: 'Healthcare' }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-stone-900/[0.06] bg-white/85 px-4 backdrop-blur-xl sm:px-6">
      {/* Left: Mobile menu button + Page breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-900/[0.08] bg-stone-50 text-stone-700 hover:bg-stone-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60 font-display">
            {meta.category}
          </span>
          <span className="hidden sm:inline text-stone-300">/</span>
          <h1 className="font-display text-sm sm:text-base font-bold text-stone-900 truncate">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick SOS Capsule & User Badge */}
      <div className="flex items-center gap-2.5">
        {user?.role !== 'admin' && (
          <Link
            to="/sos"
            className="relative flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/90 px-3 py-1 text-xs font-bold text-rose-700 shadow-2xs transition hover:bg-rose-100 hover:border-rose-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-600"></span>
            </span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
            <span className="tracking-wide">SOS</span>
          </Link>
        )}

        {user && (
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-stone-900/[0.07] bg-stone-50/80 px-2.5 py-1 shadow-2xs">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              <User className="h-3 w-3" />
            </div>
            <span className="text-xs font-semibold text-stone-700 max-w-[120px] truncate">
              {user.full_name}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
