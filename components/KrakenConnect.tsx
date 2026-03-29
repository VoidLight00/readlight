'use client'

import { useState, useEffect, useRef } from 'react'
import { SparkleIcon } from '@/components/icons'

const MAX_LENGTH = 500

interface Reply {
  id: string
  text: string
  timestamp: number
  questionId?: string
}

interface KrakenConnectProps {
  book?: string
  author?: string
  page?: number
  captures?: string[]
  sessionKey?: string
}

export function KrakenConnect({ book, author, page, captures, sessionKey: propSessionKey }: KrakenConnectProps) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [replies, setReplies] = useState<Reply[]>([])
  const [lastSeen, setLastSeen] = useState(0)
  const [hasNew, setHasNew] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const repliesEndRef = useRef<HTMLDivElement>(null)

  const sessionKey = propSessionKey || (book ? `book-${book.slice(0, 20).replace(/\s/g, '-')}` : 'general')

  // Poll for replies when panel is open
  useEffect(() => {
    if (!open) return

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/store-reply?sessionKey=${encodeURIComponent(sessionKey)}&since=${lastSeen}`
        )
        const data = await res.json()
        if (data.replies?.length) {
          setReplies((prev) => [...prev, ...data.replies])
          setLastSeen(data.replies[data.replies.length - 1].timestamp)
          setHasNew(true)
          setTimeout(() => setHasNew(false), 3000)
        }
      } catch {
        // silent — polling failure is not critical
      }
    }

    poll()
    pollRef.current = setInterval(poll, 4000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [open, sessionKey, lastSeen])

  // Auto-scroll to newest reply
  useEffect(() => {
    repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [replies.length])

  const send = async () => {
    if (!question.trim() || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/ask-kraken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book,
          author,
          page,
          question: question.trim().slice(0, MAX_LENGTH),
          captures,
          sessionKey,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus('sent')
      setQuestion('')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3.5 py-2 border border-border text-muted-foreground text-[13px] font-medium cursor-pointer tracking-wide hover:border-primary/50 hover:text-white transition-colors bg-transparent"
      >
        <SparkleIcon size={14} />
        크라켄에게 물어보기
        {hasNew && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
        )}
      </button>
    )
  }

  return (
    <div className="border border-border border-l-[3px] border-l-primary bg-[var(--surface-2)] p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-caption">크라켄 채널</span>
        <button
          onClick={() => setOpen(false)}
          className="bg-transparent border-none text-muted-foreground cursor-pointer text-base hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mb-3 max-h-[200px] overflow-y-auto">
          {replies.map((r) => (
            <div
              key={r.id}
              className="p-2.5 px-3 bg-[var(--surface-1)] border-l-2 border-l-primary mb-1.5 text-[13px] leading-relaxed text-white"
            >
              <div className="text-[10px] text-muted-foreground mb-1 tracking-wider uppercase font-medium">
                Kraken
              </div>
              {r.text.length > 500 ? `${r.text.slice(0, 500)}...` : r.text}
            </div>
          ))}
          <div ref={repliesEndRef} />
        </div>
      )}

      {replies.length === 0 && (
        <p className="text-xs text-muted-foreground mb-3">
          질문을 보내면 크라켄이 답변합니다. 답변은 여기에 표시됩니다.
        </p>
      )}

      {/* Book context */}
      {book && (
        <p className="text-xs text-muted-foreground mb-2.5">
          {book}{page ? ` · ${page}쪽` : ''}
        </p>
      )}

      {/* Question input */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="질문을 입력하세요..."
        rows={3}
        className="w-full bg-[var(--surface-1)] border border-border text-white text-sm p-2.5 resize-y outline-none font-[inherit] box-border focus:border-primary/50 transition-colors"
        onKeyDown={(e) => e.key === 'Enter' && e.metaKey && send()}
      />

      <div className="flex justify-between items-center mt-1.5">
        <span className="text-[11px] text-muted-foreground">
          {question.length}/{MAX_LENGTH} · ⌘+Enter
        </span>
        <button
          onClick={send}
          disabled={status === 'sending' || !question.trim()}
          className={`px-4 py-1.5 font-bold text-[13px] transition-colors ${
            status === 'sent'
              ? 'bg-transparent border border-border text-muted-foreground'
              : status === 'error'
                ? 'bg-destructive text-white border-none'
                : 'bg-primary text-primary-foreground border-none hover:bg-primary/90'
          } ${!question.trim() ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${
            status === 'sending' ? 'cursor-wait' : ''
          }`}
        >
          {status === 'sending'
            ? '전송 중...'
            : status === 'sent'
              ? '전송 완료'
              : status === 'error'
                ? '실패 — 다시 시도'
                : '전송'}
        </button>
      </div>
    </div>
  )
}
