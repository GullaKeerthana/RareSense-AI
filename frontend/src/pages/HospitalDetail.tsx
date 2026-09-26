import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { api, extractErrorMessage } from '../api/client'
import type { Hospital } from '../api/types'
import { useGeolocation } from '../hooks/useGeolocation'
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  Star,
  ShieldAlert,
  ArrowLeft,
  Navigation,
  Clock,
  Car,
  Loader2,
  AlertCircle,
  Stethoscope,
  Activity,
} from 'lucide-react'

interface RouteInfo {
  coordinates: [number, number][]
  distanceKm: number
  durationMin: number
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40] })
    }
  }, [map, points])
  return null
}

export default function HospitalDetail() {
  const { id } = useParams()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState<RouteInfo | null>(null)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const { coords, status, locate } = useGeolocation()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get<Hospital>(`/hospitals/${id}`)
      .then(({ data }) => setHospital(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!coords || !hospital) return
    setRouteLoading(true)
    setRouteError(null)
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords.lng},${coords.lat};${hospital.lng},${hospital.lat}?overview=full&geometries=geojson`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code !== 'Ok' || !data.routes?.[0]) {
          setRouteError('Could not calculate a driving route right now.')
          return
        }
        const r = data.routes[0]
        setRoute({
          coordinates: r.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]),
          distanceKm: r.distance / 1000,
          durationMin: r.duration / 60,
        })
      })
      .catch(() => setRouteError('Could not calculate a driving route right now.'))
      .finally(() => setRouteLoading(false))
  }, [coords, hospital])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span>Loading hospital details…</span>
        </div>
      </div>
    )
  }

  if (error || !hospital) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-7 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
          <p className="mt-2 text-sm font-semibold text-rose-800">{error || 'Hospital details not found.'}</p>
          <Link
            to="/hospitals"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Hospital Finder</span>
          </Link>
        </div>
      </div>
    )
  }

  const mapPoints: [number, number][] = route
    ? route.coordinates
    : [[hospital.lat, hospital.lng]]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb Back */}
      <Link
        to="/hospitals"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-indigo-700 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Hospital Finder</span>
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {/* Left Column: Hospital Info & Directions */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-8 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 border border-indigo-200/60 font-display">
                  <Building2 className="h-3 w-3" />
                  {hospital.type}
                </span>
                <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">{hospital.name}</h1>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/80 shadow-2xs font-display">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{hospital.rating}</span>
              </div>
            </div>

            {/* Address */}
            <p className="mt-3 flex items-start gap-1.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <MapPin className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
              <span>{hospital.address}, {hospital.city}, {hospital.state}</span>
            </p>

            {/* Contacts & Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-stone-100 pt-5">
              <a
                href={`tel:${hospital.phone}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/[0.08] bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-900 transition"
              >
                <Phone className="h-3.5 w-3.5 text-indigo-600" />
                <span>{hospital.phone}</span>
              </a>

              {hospital.website && (
                <a
                  href={hospital.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/[0.08] bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                >
                  <Globe className="h-3.5 w-3.5 text-stone-500" />
                  <span>Visit Website</span>
                </a>
              )}

              {hospital.emergency_services && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 border border-rose-200">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>24×7 Emergency Care</span>
                </span>
              )}
            </div>

            {/* Specialties */}
            <div className="mt-6 border-t border-stone-100 pt-5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 font-display">
                <Stethoscope className="h-3.5 w-3.5 text-indigo-600" />
                <span>Specialized Medical Departments</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {hospital.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 border border-indigo-200/60"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="mt-5 border-t border-stone-100 pt-5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 font-display">
                <Activity className="h-3.5 w-3.5 text-stone-400" />
                <span>Diagnostic & Care Services</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {hospital.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 border border-stone-200/60"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Driving Directions Section */}
            <div className="mt-6 border-t border-stone-100 pt-5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 font-display">
                <Navigation className="h-3.5 w-3.5 text-indigo-600" />
                <span>Live Route & Travel Estimate</span>
              </div>

              {!coords ? (
                <div className="mt-3">
                  <button
                    onClick={locate}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition shadow-2xs"
                  >
                    {status === 'locating' ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                        <span>Detecting location…</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Get Live Driving Route & ETA From My Location</span>
                      </>
                    )}
                  </button>
                  {status === 'denied' && (
                    <p className="mt-2 text-xs text-rose-500">Location permission was denied in your browser.</p>
                  )}
                </div>
              ) : routeLoading ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <span>Calculating fastest driving route via OSRM…</span>
                </div>
              ) : routeError ? (
                <p className="mt-3 text-xs text-rose-600">{routeError}</p>
              ) : route ? (
                <div className="mt-3 flex items-center gap-4 rounded-2xl bg-indigo-50/80 p-3.5 text-xs font-semibold text-indigo-900 border border-indigo-200/80">
                  <div className="flex items-center gap-1.5 font-display font-bold">
                    <Clock className="h-4 w-4 text-indigo-700" />
                    <span>~{Math.round(route.durationMin)} min drive</span>
                  </div>
                  <div className="text-indigo-300">·</div>
                  <div className="flex items-center gap-1.5 font-display font-bold">
                    <Car className="h-4 w-4 text-indigo-700" />
                    <span>{route.distanceKm.toFixed(1)} km by road</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Column: Live Map Container */}
        <div className="h-[440px] overflow-hidden rounded-3xl border border-stone-900/[0.08] shadow-[0_16px_40px_-8px_rgba(15,23,42,0.1),0_4px_12px_-2px_rgba(15,23,42,0.03)] lg:h-auto lg:min-h-[550px]">
          <MapContainer center={[hospital.lat, hospital.lng]} zoom={12} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[hospital.lat, hospital.lng]}>
              <Popup>
                <strong className="font-display font-bold">{hospital.name}</strong>
              </Popup>
            </Marker>
            {coords && (
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Your current location</Popup>
              </Marker>
            )}
            {route && <Polyline positions={route.coordinates} pathOptions={{ color: '#0d9488', weight: 4 }} />}
            <FitBounds points={mapPoints} />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
