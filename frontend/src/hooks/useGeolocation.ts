import { useState } from 'react'

interface Coords {
  lat: number
  lng: number
}

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [status, setStatus] = useState<'idle' | 'locating' | 'granted' | 'denied' | 'unsupported'>('idle')

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus('unsupported')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setStatus('granted')
      },
      () => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return { coords, status, locate }
}
