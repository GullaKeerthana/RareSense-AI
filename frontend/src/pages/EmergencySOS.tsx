import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { EmergencyContact, Hospital } from '../api/types'
import { useGeolocation } from '../hooks/useGeolocation'
import {
  ShieldAlert,
  PhoneCall,
  Navigation,
  Phone,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function EmergencySOS() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingHospitals, setLoadingHospitals] = useState(false)
  const { coords, status, locate } = useGeolocation()

  useEffect(() => {
    api.get<EmergencyContact[]>('/emergency/contacts').then(({ data }) => setContacts(data))
  }, [])

  useEffect(() => {
    if (!coords) return
    setLoadingHospitals(true)
    api
      .get<Hospital[]>('/hospitals', { params: { emergency_only: true, lat: coords.lat, lng: coords.lng } })
      .then(({ data }) => setHospitals(data.slice(0, 5)))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoadingHospitals(false))
  }, [coords])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* High-Visibility Emergency Header */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-400/40 bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 p-7 sm:p-9 text-white shadow-2xl shadow-rose-950/20">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-rose-400/20 blur-3xl" />

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md text-white">
            <ShieldAlert className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Emergency SOS & Crisis Response
              </h1>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-200 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
              </span>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-rose-100 leading-relaxed max-w-xl">
              If you or a loved one is facing an acute medical crisis, tap to dial national emergency helplines or locate your nearest 24×7 emergency facility immediately.
            </p>
          </div>
        </div>
      </div>

      {/* National Emergency Contacts */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            01 / RAPID HELPLINES
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {contacts.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number.replace(/\s+/g, '')}`}
              className="group flex flex-col justify-between rounded-3xl border border-rose-100 bg-white p-6 text-center shadow-[0_16px_40px_-8px_rgba(225,29,72,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-150 hover:-translate-y-1 hover:border-rose-300 hover:shadow-[0_20px_48px_-10px_rgba(225,29,72,0.18)]"
            >
              <div>
                <div className="flex items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 border border-rose-200/80 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 font-display text-3xl font-extrabold text-rose-600 tracking-tight">{contact.number}</p>
                <p className="mt-1 text-xs font-bold text-stone-900">{contact.name}</p>
                <p className="mt-1 text-[11px] text-stone-500 leading-snug">{contact.description}</p>
              </div>

              <div className="mt-5 flex items-center justify-center gap-1.5 rounded-full bg-rose-50 py-2.5 text-xs font-bold text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5" />
                <span>Tap to Call</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Nearby 24x7 Emergency Hospitals */}
      <div className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                02 / EMERGENCY CASUALTY DEPARTMENTS
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-stone-900">
              Nearby 24×7 Emergency Hospitals
            </h2>
            <p className="text-xs text-stone-500">
              Facilities with active round-the-clock emergency casualty departments.
            </p>
          </div>

          <button
            onClick={locate}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition shadow-2xs ${
              coords
                ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                : 'border-stone-900/[0.08] bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300'
            }`}
          >
            {status === 'locating' ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                <span>Detecting location…</span>
              </>
            ) : (
              <>
                <Navigation className={`h-3.5 w-3.5 ${coords ? 'text-indigo-600' : 'text-stone-400'}`} />
                <span>{coords ? 'Sorted by proximity to you' : 'Find hospitals near me'}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {status === 'denied' && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>Location access was denied. Please allow location to rank nearest emergency facilities.</span>
          </div>
        )}

        <div className="mt-5 space-y-3.5">
          {loadingHospitals &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-3xl border border-stone-200 bg-stone-100" />
            ))}

          {!loadingHospitals &&
            hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-stone-900/[0.06] bg-white p-5 sm:p-6 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all hover:border-indigo-300 hover:shadow-md"
              >
                <Link to={`/hospitals/${hospital.id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm sm:text-base font-bold text-stone-900 group-hover:text-indigo-800 transition-colors truncate">
                      {hospital.name}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                      24×7
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    {hospital.address ? `${hospital.address}, ` : ''}{hospital.city}, {hospital.state}
                  </p>
                </Link>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                  {hospital.distance_km != null && (
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-700">
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{hospital.distance_km} km</span>
                    </div>
                  )}

                  <a
                    href={`tel:${hospital.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Emergency</span>
                  </a>
                </div>
              </div>
            ))}

          {!loadingHospitals && !coords && (
            <div className="rounded-3xl border border-dashed border-stone-300/80 bg-white p-10 text-center">
              <Navigation className="mx-auto h-9 w-9 text-stone-300" />
              <p className="mt-3 text-sm font-bold text-stone-700 font-display">Location not enabled</p>
              <p className="mt-1 text-xs text-stone-400 max-w-sm mx-auto">
                Click "Find hospitals near me" above to detect your coordinates and locate the closest emergency center.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
