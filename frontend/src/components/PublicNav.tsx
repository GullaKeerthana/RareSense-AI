import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sparkles,
  ShieldAlert,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Landmark,
  Building2,
  Users,
} from 'lucide-react'

export default function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/knowledge-hub', label: 'Knowledge Hub', icon: BookOpen },
    { to: '/schemes', label: 'Schemes', icon: Landmark },
    { to: '/hospitals', label: 'Hospitals', icon: Building2 },
    { to: '/ngos', label: 'NGOs', icon: Users },
  ]

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex items-center justify-between rounded-full border border-stone-900/[0.08] bg-white/90 px-4 py-2.5 shadow-[0_16px_36px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.02)] backdrop-blur-2xl">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-emerald-500 shadow-sm shadow-indigo-700/20 ring-1 ring-indigo-600/30 transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-white stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-base font-bold text-stone-900 tracking-tight">
              RareSense
            </span>
            <span className="rounded-full bg-indigo-100/90 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-indigo-800 ring-1 ring-inset ring-indigo-600/20 font-display">
              AI
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = location.pathname.startsWith(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* SOS Capsule */}
          <Link
            to="/sos"
            className="relative flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 shadow-2xs transition hover:bg-rose-100"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-600"></span>
            </span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
            <span className="tracking-wide">SOS</span>
          </Link>

          <Link
            to="/login"
            className="hidden sm:inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-700/20 transition hover:from-indigo-700 hover:to-indigo-800 hover:shadow"
          >
            <span>Get started</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-1.5 text-stone-600 hover:bg-stone-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="mt-2 rounded-3xl border border-stone-900/[0.08] bg-white/95 p-4 shadow-xl backdrop-blur-2xl md:hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-indigo-50 hover:text-indigo-900"
                >
                  <Icon className="h-4 w-4 text-indigo-600" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
            <div className="border-t border-stone-100 pt-2 mt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-full border border-stone-200 py-2 text-xs font-semibold text-stone-700"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-full bg-indigo-600 py-2 text-xs font-bold text-white shadow-sm"
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
