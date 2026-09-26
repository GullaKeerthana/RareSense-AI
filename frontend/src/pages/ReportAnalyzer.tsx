import { useRef, useState } from 'react'
import { api, extractErrorMessage } from '../api/client'
import type { ReportAnalysis } from '../api/types'
import Disclaimer from '../components/Disclaimer'
import {
  FileText,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Flag,
} from 'lucide-react'

export default function ReportAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<ReportAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (selected: File | undefined) => {
    if (!selected) return
    setFile(selected)
    setResult(null)
    setError(null)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post<ReportAnalysis>('/reports/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-stone-900/[0.06]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Medical Report Analyzer
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 border border-indigo-200/60 font-display">
              AI Plain-Language Summary
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Upload genetic test reports, biopsy results, or clinical discharge summaries for plain-language clinical interpretation.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Disclaimer text="Educational only. This AI tool does not formulate a medical diagnosis. Always review findings directly with the ordering physician." />
      </div>

      {/* Upload Zone */}
      <div className="mt-6 rounded-3xl border border-stone-900/[0.06] bg-white p-6 sm:p-8 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)]">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />

        {!preview ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-300/80 bg-stone-50/50 p-8 sm:p-14 text-center cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50/40"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-indigo-700 shadow-2xs border border-stone-200/80 transition-transform group-hover:scale-105">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h2 className="mt-5 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-indigo-900">
              Click or drag to upload report image
            </h2>
            <p className="mt-1.5 text-xs text-stone-500 max-w-sm leading-relaxed">
              Supports JPEG, PNG, or WEBP images. Ensure text, tables, and biomarker values are clearly readable.
            </p>

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-stone-700 border border-stone-200 shadow-2xs group-hover:border-indigo-300">
              <FileCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>Select File</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-stone-900/[0.08] bg-stone-50 p-2.5 shadow-2xs max-w-md w-full">
              <img
                src={preview}
                alt="Medical Report Preview"
                className="max-h-72 w-full object-contain rounded-xl bg-white"
              />
              <div className="mt-2.5 flex items-center justify-between px-2 text-xs text-stone-500">
                <span className="truncate max-w-[200px] font-medium">{file?.name}</span>
                {file && <span>{(file.size / 1024).toFixed(0)} KB</span>}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/[0.08] bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition"
              >
                <RefreshCw className="h-3.5 w-3.5 text-stone-400" />
                <span>Choose Different Image</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.3)] transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-[0_14px_30px_-5px_rgba(79,70,229,0.4)] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing report biomarkers…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze Report with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Output Presentation */}
      {result && (
        <div className="mt-8 space-y-6 rounded-3xl border border-indigo-200/90 bg-white p-6 sm:p-8 shadow-[0_16px_40px_-8px_rgba(79,70,229,0.12),0_4px_12px_-2px_rgba(15,23,42,0.03)] animate-in fade-in duration-200">
          {/* Executive Summary */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 to-emerald-50/50 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-800 font-display">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Plain-Language Report Summary</span>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-stone-800 font-medium">
              {result.summary}
            </p>
          </div>

          {/* Key Findings Checklist */}
          {result.key_findings.length > 0 && (
            <div className="border-t border-stone-100 pt-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 mb-3.5 font-display">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                <span>Extracted Key Findings & Values ({result.key_findings.length})</span>
              </div>
              <ul className="space-y-2.5">
                {result.key_findings.map((finding, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-stone-900/[0.06] bg-stone-50/50 p-3.5 text-xs sm:text-sm text-stone-700"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-display text-[10px] font-bold text-indigo-800">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flagged Items / Discussion Points */}
          {result.flagged_items.length > 0 && (
            <div className="border-t border-stone-100 pt-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-3.5 font-display">
                <Flag className="h-4 w-4 text-amber-600" />
                <span>Items Worth Discussing With Your Physician</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.flagged_items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-950 shadow-2xs"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-stone-100">
            <Disclaimer text={result.disclaimer} />
          </div>
        </div>
      )}
    </div>
  )
}
