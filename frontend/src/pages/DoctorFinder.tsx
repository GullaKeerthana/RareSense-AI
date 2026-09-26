import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, extractErrorMessage } from '../api/client'
import type { Hospital } from '../api/types'
import { useGeolocation } from '../hooks/useGeolocation'
import {
  Stethoscope,
  MapPin,
  Star,
  Navigation,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'

const SPECIALTIES = [
  'Medical Genetics',
  'Pediatric Neurology',
  'Hematology',
  'Oncology',
  'Nephrology',
  'Cardiology',
  'Neurology',
  'Endocrinology',
  'Immunology',
  'Gastroenterology',
]

export default function DoctorFinder() {
  const [specialty, setSpecialty] = useState('Medical Genetics')
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { coords, status, locate } = useGeolocation()

  useEffect(() => {
    setLoading(true)
    setError(null)
    api
      .get<Hospital[]>('/hospitals', {
        params: { specialty, ...(coords ? { lat: coords.lat, lng: coords.lng } : {}) },
      })
      .then(({ data }) => setHospitals(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [specialty, coords])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-stone-900/[0.06]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Doctor & Specialist Finder
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 border border-indigo-200/60 font-display">
              Clinical Teams
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Locate accredited hospitals featuring dedicated departments and multidisciplinary teams for rare conditions.
          </p>
        </div>
      </div>

      {/* Specialty Filter Chips */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
            01 / SELECT CLINICAL SPECIALTY
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => {
            const isSelected = specialty === s
            return (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all shadow-2xs ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-700/20'
                    : 'border border-stone-900/[0.08] bg-white text-stone-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900'
                }`}
              >
                <Stethoscope className={`h-3.5 w-3.5 ${isSelected ? 'text-indigo-100' : 'text-stone-400'}`} />
                <span>{s}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Location Bar */}
      <div className="mt-6 flex items-center justify-between">
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
              <span>Locating…</span>
            </>
          ) : (
            <>
              <Navigation className={`h-3.5 w-3.5 ${coords ? 'text-indigo-600' : 'text-stone-400'}`} />
              <span>{coords ? 'Sorted by Proximity to You' : 'Sort by My Location'}</span>
            </>
          )}
        </button>

        {!loading && (
          <span className="text-xs text-stone-400 font-medium">
            {hospitals.length} hospital department{hospitals.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results List */}
      <div className="mt-6 space-y-4">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl border border-stone-200 bg-stone-100" />
          ))}

        {!loading &&
          hospitals.map((hospital) => (
            <Link
              key={hospital.id}
              to={`/hospitals/${hospital.id}`}
              className="group block rounded-3xl border border-stone-900/[0.06] bg-white p-5 sm:p-6 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-[0_20px_48px_-10px_rgba(79,70,229,0.14)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 border border-indigo-200/60 font-display">
                      <Stethoscope className="h-3 w-3" />
                      {specialty} Team
                    </span>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs font-medium text-stone-500">{hospital.type}</span>
                  </div>

                  <h2 className="mt-2 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-indigo-800 transition-colors">
                    {hospital.name}
                  </h2>

                  <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                    <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                    <span>{hospital.address}, {hospital.city}, {hospital.state}</span>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200/60 font-display">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{hospital.rating}</span>
                  </div>

                  {hospital.distance_km != null && (
                    <p className="flex items-center gap-1 text-xs font-bold text-indigo-700">
                      <Navigation className="h-3 w-3" />
                      <span>{hospital.distance_km} km away</span>
                    </p>
                  )}

                  <div className="mt-1 hidden sm:inline-flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform">
                    <span>View department</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

        {!loading && hospitals.length === 0 && (
          <div className="rounded-3xl border border-dashed border-stone-300/80 bg-white p-10 text-center">
            <Stethoscope className="mx-auto h-9 w-9 text-stone-300" />
            <p className="mt-2 text-sm font-bold text-stone-700 font-display">No departments found</p>
            <p className="mt-1 text-xs text-stone-400">
              No hospitals currently list a dedicated {specialty} department in this database.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
