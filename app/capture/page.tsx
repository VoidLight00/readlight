'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CaptureForm } from '@/components/CaptureForm'
import { CaptureCard } from '@/components/CaptureCard'
import { useReadingStore } from '@/lib/reading/store'
import { useBookStore } from '@/lib/books/store'
import type { AIInsight } from '@/types'

export default function CapturePage() {
  const { activeSessionId, sessions, addCapture, updateCapture } = useReadingStore()
  const { getBook } = useBookStore()
  const [search, setSearch] = useState('')

  function handleSave(passage: string, note?: string, tags?: string[], aiInsights?: AIInsight) {
    if (!activeSessionId) return

    const capture = addCapture(activeSessionId, passage, note, tags)

    if (aiInsights) {
      updateCapture(activeSessionId, capture.id, { aiInsights })
    }
  }

  const allCaptures = useMemo(() => {
    return sessions
      .flatMap((s) =>
        s.captures.map((c) => ({
          ...c,
          bookId: s.bookId,
          sessionId: s.id,
        }))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [sessions])

  const filteredCaptures = useMemo(() => {
    if (!search.trim()) return allCaptures
    const q = search.toLowerCase()
    return allCaptures.filter(
      (c) =>
        c.passage.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [allCaptures, search])

  if (activeSessionId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold text-white">글귀 캡처</h1>
        <p className="text-sm text-muted-foreground">
          인상 깊은 구절을 기록하세요
        </p>
        <CaptureForm onSave={handleSave} />
      </div>
    )
  }

  if (allCaptures.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold text-white">글귀 캡처</h1>
        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <p className="text-4xl mb-3">📖</p>
            <p className="text-muted-foreground">
              세션을 먼저 시작해주세요
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              세션 탭에서 책을 선택하고 독서를 시작하세요
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-white">
        저장된 글귀 ({allCaptures.length}개)
      </h1>
      <Input
        placeholder="구절이나 태그로 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-card border-border min-h-[44px]"
      />

      <div className="space-y-3">
        {filteredCaptures.map((capture) => {
          const book = getBook(capture.bookId)
          const bookInfo = book
            ? `${book.title} — ${book.author}`
            : '알 수 없는 책'
          return (
            <CaptureCard
              key={capture.id}
              capture={capture}
              sessionId={capture.sessionId}
              bookInfo={bookInfo}
            />
          )
        })}
        {filteredCaptures.length === 0 && search.trim() && (
          <p className="text-sm text-muted-foreground text-center py-4">
            검색 결과가 없습니다
          </p>
        )}
      </div>
    </div>
  )
}
