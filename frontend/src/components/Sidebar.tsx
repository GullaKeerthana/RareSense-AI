import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Bot,
  Activity,
  Compass,
  Building2,
  Stethoscope,
  FileText,
  BookOpen,
  Landmark,
  Users,
  ShieldAlert,
  LogOut,
  User,
  Sparkles,
  X,
  PhoneCall,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react'

interface SidebarProps {
  mobileOpen: boolean
  onCloseMobile: () => void
}

interface NavItem {
  to: string
  label: string
  icon: typeof Bot
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'AI Intelligence',
    items: [
      { to: '/assistant', label: 'AI Assistant', icon: Bot, badge: 'Live' },
      { to: '/symptom-checker', label: 'Symptom Checker', icon: Activity },
      { to: '/care-navigator', label: 'Care Navigator', icon: Compass },
    ],
  },
  {
    title: 'Find Care',
    items: [
      { to: '/hospitals', label: 'Hospital Finder', icon: Building2 },
      { to: '/doctors', label: 'Doctor Finder', icon: Stethoscope },
      { to: '/reports', label: 'Report Analyzer', icon: FileText },
    ],
  },
  {
    title: 'Knowledge & Policy',
    items: [
      { to: '/knowledge-hub', label: 'Knowledge Hub', icon: BookOpen },
      { to: '/schemes', label: 'Government Schemes', icon: Landmark },
      { to: '/ngos', label: 'NGO Directory', icon: Users },
    ],
  },
]

const adminSections: NavSection[] = [
  {
    title: 'Admin Console',
    items: [
      { to: '/admin', label: 'Overview', icon: LayoutGrid },
      { to: '/admin/hospitals', label: 'Manage Hospitals', icon: Building2 },
      { to: '/admin/knowledge-hub', label: 'Manage Knowledge Hub', icon: BookOpen },
      { to: '/admin/schemes', label: 'Manage Schemes', icon: Landmark },
      { to: '/admin/ngos', label: 'Manage NGOs', icon: Users },
    ],
  },
]

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isAdmin = user?.role === 'admin'
  const sections = isAdmin ? adminSections : navSections

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'caregiver':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'ngo':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'admin':
        return 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30'
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  }

  const sidebarContent = (
    <div
      className={`flex h-full flex-col justify-between overflow-y-auto p-4 sm:p-5 ${
        isAdmin ? 'bg-stone-950' : ''
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        <div
          className={`flex items-center justify-between pb-5 border-b ${
            isAdmin ? 'border-white/[0.08]' : 'border-stone-900/[0.06]'
          }`}
        >
          <Link to={isAdmin ? '/admin' : '/'} onClick={onCloseMobile} className="group flex items-center gap-2.5">
            <div
              className={`relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-md ring-1 transition-transform duration-200 group-hover:scale-105 ${
                isAdmin
                  ? 'bg-gradient-to-tr from-stone-700 via-stone-800 to-indigo-700 shadow-black/30 ring-white/10'
                  : 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-emerald-500 shadow-indigo-700/20 ring-indigo-600/30'
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="h-5 w-5 text-white stroke-[2.2]" />
              ) : (
                <Sparkles className="h-5 w-5 text-white stroke-[2.2]" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span
                  className={`font-display font-bold tracking-tight text-lg ${
                    isAdmin ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  RareSense
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider font-display ring-1 ring-inset ${
                    isAdmin
                      ? 'bg-indigo-500/20 text-indigo-200 ring-indigo-400/30'
                      : 'bg-indigo-100/90 text-indigo-800 ring-indigo-600/20'
                  }`}
                >
                  AI
                </span>
              </div>
              <span
                className={`text-[10px] font-medium tracking-widest uppercase mt-0.5 font-display ${
                  isAdmin ? 'text-indigo-300/80' : 'text-stone-400'
                }`}
              >
                {isAdmin ? 'Admin Console' : 'Clinical Intelligence'}
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className={`rounded-xl p-1.5 lg:hidden ${
              isAdmin
                ? 'text-stone-400 hover:bg-white/10 hover:text-white'
                : 'text-stone-400 hover:bg-stone-100 hover:text-stone-700'
            }`}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Emergency SOS Pinned Banner — patient-facing only, not part of the admin console */}
        {!isAdmin && (
          <div className="mt-4">
            <Link
              to="/sos"
              onClick={onCloseMobile}
              className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border p-3 transition-all ${
                location.pathname === '/sos'
                  ? 'border-rose-400 bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'border-rose-200 bg-gradient-to-r from-rose-50/90 to-rose-100/60 text-rose-900 hover:border-rose-300 hover:bg-rose-100/90 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                    location.pathname === '/sos'
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-600 text-white shadow-xs'
                  }`}
                >
                  <ShieldAlert className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xs font-bold tracking-tight">Emergency SOS</span>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-600"></span>
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      location.pathname === '/sos' ? 'text-rose-100' : 'text-rose-700'
                    }`}
                  >
                    24×7 Rapid Helplines
                  </span>
                </div>
              </div>
              <PhoneCall
                className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${
                  location.pathname === '/sos' ? 'text-white' : 'text-rose-600'
                }`}
              />
            </Link>
          </div>
        )}

        {/* Grouped Nav Sections */}
        <div className="mt-5 space-y-5">
          {sections.map((section) => (
            <div key={section.title}>
              <div
                className={`flex items-center gap-1 px-3 pb-2 text-[10px] font-bold uppercase tracking-widest font-display ${
                  isAdmin ? 'text-indigo-300/70' : 'text-stone-400'
                }`}
              >
                {isAdmin && <ShieldCheck className="h-3 w-3 text-indigo-400" />}
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = location.pathname === item.to
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onCloseMobile}
                      className={`group flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium transition-all ${
                        active
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-700/20'
                          : isAdmin
                            ? 'text-stone-300 hover:bg-white/[0.06] hover:text-white'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                            active
                              ? 'text-white'
                              : isAdmin
                                ? 'text-stone-500 group-hover:text-indigo-400'
                                : 'text-stone-400 group-hover:text-indigo-700'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                            active
                              ? 'bg-indigo-800/80 text-indigo-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Area */}
      <div className={`mt-6 border-t pt-4 ${isAdmin ? 'border-white/[0.08]' : 'border-stone-900/[0.06]'}`}>
        <div
          className={`flex items-center justify-between gap-2 rounded-2xl border p-2.5 ${
            isAdmin ? 'border-white/[0.08] bg-white/[0.04]' : 'border-stone-900/[0.06] bg-stone-50/80'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-emerald-600 text-xs font-bold text-white shadow-2xs">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 text-left">
              <div className={`truncate text-xs font-bold ${isAdmin ? 'text-white' : 'text-stone-800'}`}>
                {user?.full_name || 'User Profile'}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`inline-block rounded-full border px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${getRoleBadgeStyle(
                    user?.role,
                  )}`}
                >
                  {user?.role || 'Member'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout()
              navigate('/')
              onCloseMobile()
            }}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-2xs transition ${
              isAdmin
                ? 'border-white/[0.1] bg-white/[0.04] text-stone-300 hover:bg-rose-500/10 hover:border-rose-400/30 hover:text-rose-300'
                : 'border-stone-900/[0.08] bg-white text-stone-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700'
            }`}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:backdrop-blur-xl ${
          isAdmin ? 'lg:border-white/[0.06] lg:bg-stone-950' : 'lg:border-stone-900/[0.07] lg:bg-white/95'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isAdmin ? 'bg-stone-950' : 'bg-white'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
