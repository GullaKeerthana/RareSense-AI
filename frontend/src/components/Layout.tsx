import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'
import PublicNav from './PublicNav'
import { ShieldCheck, Sparkles } from 'lucide-react'

export default function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Authenticated workspace shell
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-indigo-500 selection:text-white">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <div className="flex min-h-screen flex-col lg:pl-64">
          <TopHeader onOpenMobile={() => setMobileOpen(true)} />
          <main className="flex-1 pb-10">{children}</main>
        </div>
      </div>
    )
  }

  // Public / Logged-out Layout with Floating Monorail Nav
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 selection:bg-indigo-500 selection:text-white">
      {!isAuthPage && <PublicNav />}
      <main className="flex-1">{children}</main>
      
      {!isAuthPage && (
        <footer className="mt-auto border-t border-stone-900/[0.06] bg-white/70 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-display text-base font-bold text-stone-800">RareSense AI</span>
                <span className="text-stone-300">·</span>
                <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                  Trusted Rare Disease Clinical Intelligence
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-stone-500">
                <Link to="/knowledge-hub" className="hover:text-indigo-700 transition">
                  Knowledge Hub
                </Link>
                <Link to="/schemes" className="hover:text-indigo-700 transition">
                  Government Schemes
                </Link>
                <Link to="/ngos" className="hover:text-indigo-700 transition">
                  NGO Directory
                </Link>
                <Link to="/hospitals" className="hover:text-indigo-700 transition">
                  Hospitals
                </Link>
                <Link to="/sos" className="font-semibold text-rose-600 hover:text-rose-700 transition">
                  Emergency SOS
                </Link>
              </div>
            </div>

            <div className="mt-8 border-t border-stone-900/[0.04] pt-5 text-center">
              <p className="mx-auto max-w-3xl text-xs leading-relaxed text-stone-400">
                RareSense AI provides educational information and clinical navigation support only. It is not a substitute for
                professional medical advice, diagnosis, or emergency care. In an emergency, always contact local emergency services immediately.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
