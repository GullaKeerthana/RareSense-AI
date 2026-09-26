import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
        <Compass className="h-8 w-8 animate-spin [animation-duration:8s]" />
      </div>

      <span className="mt-6 rounded-full bg-stone-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-stone-600 font-display">
        Error 404
      </span>

      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-stone-900">Page not found</h1>
      <p className="mt-2 text-xs sm:text-sm text-stone-500 max-w-xs leading-relaxed">
        The clinical resource, pathway, or page you were looking for doesn't exist or has moved.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm shadow-indigo-700/20 transition-all hover:from-indigo-700 hover:to-indigo-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/assistant"
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/[0.08] bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>AI Assistant</span>
        </Link>
      </div>
    </div>
  )
}
