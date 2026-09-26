import { AlertTriangle } from 'lucide-react'

export default function Disclaimer({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs backdrop-blur-xs">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-100/90 text-amber-700">
        <AlertTriangle className="h-3.5 w-3.5" />
      </div>
      <p className="flex-1 leading-relaxed text-amber-950 font-normal">{text}</p>
    </div>
  )
}
