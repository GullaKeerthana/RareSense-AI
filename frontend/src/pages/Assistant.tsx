import { useRef, useState, type FormEvent } from 'react'
import { api, extractErrorMessage } from '../api/client'
import type { ChatResponse, SourceRef } from '../api/types'
import {
  Bot,
  Send,
  User,
  Sparkles,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  CornerDownLeft,
  RotateCcw,
  Dna,
  Stethoscope,
  Activity,
} from 'lucide-react'

interface DisplayMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: SourceRef[]
  explanation?: string
}

const PROMPT_CATEGORIES = [
  {
    category: 'Diagnostics & Genetics',
    icon: Dna,
    prompts: [
      'What is cystic fibrosis and how is it diagnosed?',
      'How is Huntington’s disease inherited in families?',
      'What genetic panels test for Muscular Dystrophy?',
    ],
  },
  {
    category: 'Specialist Referrals',
    icon: Stethoscope,
    prompts: [
      'What specialist departments manage Ehlers-Danlos syndrome?',
      'When should a patient consult a pediatric neurologist?',
      'What role does a medical geneticist play in care?',
    ],
  },
  {
    category: 'Therapy & Management',
    icon: Activity,
    prompts: [
      'What are the standard management protocols for Gaucher disease?',
      'How does enzyme replacement therapy work?',
      'What supportive therapies help with Spinal Muscular Atrophy?',
    ],
  },
]

export default function Assistant() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedExplain, setExpandedExplain] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post<ChatResponse>('/chat', {
        message: text,
        conversation_id: conversationId,
      })
      setConversationId(data.conversation_id)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          sources: data.sources,
          explanation: data.explanation,
        },
      ])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch (err) {
      setError(extractErrorMessage(err))
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    send(input)
  }

  const handleReset = () => {
    setMessages([])
    setConversationId(undefined)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      {/* App Shell Grid */}
      <div className="grid gap-5 lg:grid-cols-12 h-[calc(100vh-7.5rem)]">
        
        {/* Left Side: Clinical Prompt Launcher & Context Rail (4 cols on lg) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-between rounded-3xl border border-stone-900/[0.06] bg-white p-5 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-display text-xs font-bold uppercase tracking-wider text-stone-800">
                  Prompt Library
                </span>
              </div>

              {messages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition"
                  title="Start a new chat"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Prompt Categories */}
            <div className="mt-4 space-y-4">
              {PROMPT_CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 font-display px-1">
                      <Icon className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{cat.category}</span>
                    </div>
                    <div className="space-y-1.5">
                      {cat.prompts.map((p) => (
                        <button
                          key={p}
                          onClick={() => send(p)}
                          className="w-full text-left rounded-2xl border border-stone-100 bg-stone-50/60 p-2.5 text-xs text-stone-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-950 transition flex items-start justify-between gap-2 group"
                        >
                          <span className="line-clamp-2 leading-relaxed">{p}</span>
                          <CornerDownLeft className="h-3 w-3 text-stone-400 group-hover:text-indigo-700 shrink-0 mt-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-stone-100 pt-3">
            <div className="rounded-2xl bg-indigo-50/60 p-3 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
              <span className="font-bold font-display block mb-0.5">Clinical Protocol</span>
              Answers are cross-referenced with verified rare disease references. Always consult medical professionals.
            </div>
          </div>
        </div>

        {/* Right Side: Main Chat Shell (8 cols on lg) */}
        <div className="flex flex-col lg:col-span-8 rounded-3xl border border-stone-900/[0.06] bg-white shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Top Chat Bar */}
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3.5 bg-stone-50/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-700 to-emerald-500 text-white shadow-sm shadow-indigo-700/20">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-stone-900">
                    RareSense AI Clinical Assistant
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Verified Citations
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 truncate">
                  Multilingual guidance grounded in clinical literature
                </p>
              </div>
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-50 lg:hidden shadow-2xs"
              >
                <RotateCcw className="h-3 w-3" />
                <span>New Chat</span>
              </button>
            )}
          </div>

          {/* Messages Viewport */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-5 text-center max-w-md mx-auto py-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-stone-900">
                    How can I assist your clinical inquiry?
                  </h2>
                  <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                    Ask about genetic conditions, diagnostic steps, medication mechanisms, or specialist referrals in your preferred language.
                  </p>
                </div>

                {/* Mobile Suggested Quick Prompt Chips */}
                <div className="w-full space-y-2 lg:hidden">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Suggested Questions
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {PROMPT_CATEGORIES[0].prompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => send(prompt)}
                        className="rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-left text-xs font-medium text-stone-700 hover:border-indigo-300 hover:bg-indigo-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => {
              const isUser = message.role === 'user'
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-xs font-semibold shadow-2xs ${
                      isUser
                        ? 'bg-stone-800 text-white'
                        : 'bg-gradient-to-tr from-indigo-700 to-emerald-500 text-white'
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-3xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isUser
                        ? 'rounded-tr-xs bg-gradient-to-r from-indigo-700 to-indigo-600 text-white font-medium'
                        : 'rounded-tl-xs border border-stone-900/[0.07] bg-white text-stone-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {!isUser && message.explanation && (
                      <div className="mt-3 border-t border-stone-100 pt-3">
                        <button
                          onClick={() =>
                            setExpandedExplain(expandedExplain === index ? null : index)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                          <span>
                            {expandedExplain === index ? 'Hide reasoning' : 'Why this clinical answer?'}
                          </span>
                          {expandedExplain === index ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </button>

                        {expandedExplain === index && (
                          <div className="mt-3 space-y-2 rounded-2xl border border-stone-900/[0.06] bg-stone-50/90 p-4 text-xs text-stone-600 animate-in fade-in duration-150">
                            <div className="flex items-center gap-1.5 font-bold text-stone-800 font-display">
                              <Info className="h-3.5 w-3.5 text-indigo-600" />
                              <span>Clinical Reasoning & Context</span>
                            </div>
                            <p className="leading-relaxed">{message.explanation}</p>

                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-stone-200/60">
                                <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 mb-1.5 font-display">
                                  <BookOpen className="h-3 w-3 text-indigo-600" />
                                  <span>Verified Knowledge Sources</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {message.sources.map((source) => (
                                    <span
                                      key={source.id}
                                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-800 border border-indigo-200/60"
                                    >
                                      {source.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-700 to-emerald-500 text-white shadow-2xs">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-3xl rounded-tl-xs border border-stone-900/[0.06] bg-white px-5 py-3.5 text-xs text-stone-500 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce" />
                    </span>
                    <span>Cross-referencing verified rare disease literature…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {error && (
            <div className="mx-4 mb-2 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sticky Bottom Input Bar */}
          <div className="border-t border-stone-100 p-3 sm:p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about a rare disease, symptom, or treatment…"
                className="flex-1 rounded-full border border-stone-200 bg-stone-50/50 px-5 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 text-xs sm:text-sm font-bold text-white shadow-sm shadow-indigo-700/20 transition-all hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
