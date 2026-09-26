import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { api, extractErrorMessage } from '../api/client'
import type { Hospital } from '../api/types'
import { useGeolocation } from '../hooks/useGeolocation'
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Star,
  Navigation,
  ArrowRight,
  Loader2,
  AlertCircle,
  Phone,
  Map,
  List,
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

const INDIA_CENTER: [number, number] = [22.9734, 78.6569]

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [map, center, zoom])
  return null
}

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [city, setCity] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')
  const { coords, status, locate } = useGeolocation()

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get<Hospital[]>('/hospitals', {
          params: {
            ...(city ? { city } : {}),
            ...(specialty ? { specialty } : {}),
            ...(coords ? { lat: coords.lat, lng: coords.lng } : {}),
          },
          signal: controller.signal,
        })
        setHospitals(data)
        if (data.length > 0) {
          setSelectedHospital((prev) => prev || data[0])
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(extractErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [city, specialty, coords])

  const mapCenter = useMemo<[number, number]>(() => {
    if (selectedHospital) return [selectedHospital.lat, selectedHospital.lng]
    if (coords) return [coords.lat, coords.lng]
    return INDIA_CENTER
  }, [selectedHospital, coords])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Top Header & Search Console Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                Hospital Finder & Live Route
              </h1>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 border border-indigo-200/60 font-display">
                Map-Forward
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Locate tertiary care centers, medical genetics facilities, and 24×7 emergency hospitals with live driving routes.
            </p>
          </div>
        </div>

        {/* Mobile View Toggle Pills */}
        <div className="flex items-center gap-1 rounded-full border border-stone-900/[0.08] bg-stone-100 p-1 sm:hidden self-start">
          <button
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
              mobileView === 'map' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
              mobileView === 'list' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List ({hospitals.length})</span>
          </button>
        </div>
      </div>

      {/* Floating Filter Ribbon */}
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-3xl border border-stone-900/[0.06] bg-white p-3.5 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]">
        <div className="relative min-w-[200px] flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search by city (e.g. Bengaluru, Delhi, Mumbai)…"
            className="w-full rounded-full border border-stone-200 bg-stone-50/50 pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="relative min-w-[180px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Filter className="h-4 w-4" />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full rounded-full border border-stone-200 bg-stone-50/50 pl-10 pr-8 py-2 text-xs sm:text-sm text-stone-900 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All medical specialties</option>
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
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
              <span>Locating…</span>
            </>
          ) : (
            <>
              <Navigation className={`h-3.5 w-3.5 ${coords ? 'text-indigo-600' : 'text-stone-400'}`} />
              <span>{coords ? 'Sorted by Proximity' : 'Sort by My Location'}</span>
            </>
          )}
        </button>
      </div>

      {status === 'denied' && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>Location permission was denied. Showing standard rating-based hospital ranking.</span>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MAP-FORWARD DOMINANT WORKSPACE */}
      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        {/* Left / Overlay Results Rail (4 cols on lg) */}
        <div
          className={`space-y-3.5 lg:col-span-5 lg:block max-h-[720px] overflow-y-auto pr-1 ${
            mobileView === 'list' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between px-1">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-stone-500">
              Hospital Directory ({hospitals.length})
            </span>
            <span className="text-[11px] text-stone-400">Click card to highlight on map</span>
          </div>

          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-3xl border border-stone-200 bg-stone-100" />
            ))}

          {!loading &&
            hospitals.map((hospital) => {
              const isSelected = selectedHospital?.id === hospital.id
              return (
                <div
                  key={hospital.id}
                  onClick={() => {
                    setSelectedHospital(hospital)
                    if (window.innerWidth < 1024) setMobileView('map')
                  }}
                  className={`group relative cursor-pointer rounded-3xl border p-5 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/40 shadow-md shadow-indigo-700/10 ring-1 ring-indigo-500/30'
                      : 'border-stone-900/[0.06] bg-white shadow-[0_16px_40px_-8px_rgba(15,23,42,0.06)] hover:border-indigo-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-sm font-bold text-stone-900 group-hover:text-indigo-800 transition-colors truncate">
                          {hospital.name}
                        </h2>
                        {hospital.emergency_services && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.2 text-[9px] font-bold text-rose-700 border border-rose-200">
                            24×7
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                        <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                        <span>{hospital.city}, {hospital.state}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200/60 font-display">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{hospital.rating}</span>
                      </div>
                      {hospital.distance_km != null && (
                        <p className="mt-1 flex items-center justify-end gap-1 text-xs font-bold text-indigo-700">
                          <Navigation className="h-3 w-3" />
                          <span>{hospital.distance_km} km</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3.5 flex flex-wrap items-center gap-1 border-t border-stone-100 pt-3">
                    {hospital.specialties.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-stone-600 border border-stone-200/60"
                      >
                        {s}
                      </span>
                    ))}
                    {hospital.specialties.length > 2 && (
                      <span className="text-[10px] text-stone-400 font-medium">
                        +{hospital.specialties.length - 2}
                      </span>
                    )}

                    <Link
                      to={`/hospitals/${hospital.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Route & Info</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )
            })}

          {!loading && hospitals.length === 0 && (
            <div className="rounded-3xl border border-dashed border-stone-300/80 bg-white p-8 text-center">
              <Building2 className="mx-auto h-8 w-8 text-stone-300" />
              <p className="mt-2 text-sm font-bold text-stone-700 font-display">No hospitals found</p>
              <p className="mt-1 text-xs text-stone-400">Try clearing your search query or selecting all specialties.</p>
            </div>
          )}
        </div>

        {/* Dominant Full-Canvas Map (7 cols on lg) */}
        <div
          className={`lg:col-span-7 relative h-[520px] sm:h-[620px] lg:h-[720px] overflow-hidden rounded-3xl border border-stone-900/[0.08] shadow-[0_20px_50px_-10px_rgba(15,23,42,0.12),0_6px_16px_-2px_rgba(15,23,42,0.04)] ${
            mobileView === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          <MapContainer center={mapCenter} zoom={coords ? 11 : 5} className="h-full w-full">
            <MapRecenter center={mapCenter} zoom={selectedHospital ? 13 : coords ? 11 : 5} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hospitals.map((hospital) => (
              <Marker
                key={hospital.id}
                position={[hospital.lat, hospital.lng]}
                eventHandlers={{
                  click: () => setSelectedHospital(hospital),
                }}
              >
                <Popup>
                  <div className="font-sans min-w-[200px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-display">
                        {hospital.type}
                      </span>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-600">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{hospital.rating}</span>
                      </div>
                    </div>
                    <strong className="text-stone-900 font-bold font-display text-sm block mt-1">
                      {hospital.name}
                    </strong>
                    <div className="text-xs text-stone-500 mt-0.5">{hospital.city}, {hospital.state}</div>
                    {hospital.distance_km != null && (
                      <div className="mt-1 text-xs font-bold text-indigo-700 flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        <span>{hospital.distance_km} km away</span>
                      </div>
                    )}
                    <div className="mt-3 pt-2 border-t border-stone-100">
                      <Link
                        to={`/hospitals/${hospital.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900"
                      >
                        <span>View Hospital & Driving Directions →</span>
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Selected Hospital Card Badge (Bottom of Map) */}
          {selectedHospital && (
            <div className="absolute bottom-4 inset-x-4 z-[1000] pointer-events-auto sm:max-w-md sm:left-4 sm:right-auto">
              <div className="rounded-2xl border border-stone-900/[0.1] bg-white/95 p-4 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60 font-display">
                      {selectedHospital.type}
                    </span>
                    <h3 className="mt-1 font-display text-sm font-bold text-stone-900 truncate">
                      {selectedHospital.name}
                    </h3>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {selectedHospital.address}, {selectedHospital.city}
                    </p>
                  </div>
                  {selectedHospital.distance_km != null && (
                    <div className="shrink-0 text-right font-display text-xs font-bold text-indigo-700">
                      <span>{selectedHospital.distance_km} km</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5">
                  <a
                    href={`tel:${selectedHospital.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    <Phone className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{selectedHospital.phone}</span>
                  </a>
                  <Link
                    to={`/hospitals/${selectedHospital.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 transition"
                  >
                    <span>Get Directions</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
