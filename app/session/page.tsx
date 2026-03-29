'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useBookStore } from '@/lib/books/store'
import { useReadingStore } from '@/lib/reading/store'
import type { Book } from '@/types'

function formatTimer(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`
}

export default function SessionPage() {
  const router = useRouter()
  const { books, addBook } = useBookStore()
  const { activeSessionId, startSession, endSession, getActiveSession, updateWeeklyMinutes } = useReadingStore()

  const [phase, setPhase] = useState<'select' | 'goal' | 'active' | 'end'>('select')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [pageGoal, setPageGoal] = useState('20')
  const [pagesRead, setPagesRead] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [showNewBook, setShowNewBook] = useState(false)

  const activeSession = getActiveSession()

  useEffect(() => {
    if (activeSessionId && activeSession) {
      setPhase('active')
      const start = new Date(activeSession.startTime).getTime()
      setElapsed(Date.now() - start)
    }
  }, [activeSessionId, activeSession])

  useEffect(() => {
    if (phase !== 'active') return

    const interval = setInterval(() => {
      const session = getActiveSession()
      if (session) {
        setElapsed(Date.now() - new Date(session.startTime).getTime())
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, getActiveSession])

  function handleSelectBook(book: Book) {
    setSelectedBook(book)
    setPhase('goal')
  }

  function handleAddBook() {
    if (!newTitle.trim()) return
    const book = addBook(newTitle.trim(), newAuthor.trim() || '작자 미상')
    setSelectedBook(book)
    setNewTitle('')
    setNewAuthor('')
    setShowNewBook(false)
    setPhase('goal')
  }

  function handleStartSession() {
    if (!selectedBook) return
    startSession(selectedBook.id, parseInt(pageGoal) || 20)
    setPhase('active')
  }

  const handleEndSession = useCallback(() => {
    const pages = parseInt(pagesRead) || 0
    const minutes = Math.floor(elapsed / 60000)
    endSession(pages)
    updateWeeklyMinutes(minutes)
    setPhase('end')
  }, [pagesRead, elapsed, endSession, updateWeeklyMinutes])

  if (phase === 'select') {
    const readingBooks = books.filter((b) => b.status === 'reading')

    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold text-white">독서 세션</h1>
        <p className="text-sm text-muted-foreground">어떤 책을 읽을까요?</p>

        {readingBooks.length > 0 && (
          <div className="space-y-2">
            {readingBooks.map((book) => (
              <Card
                key={book.id}
                className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => handleSelectBook(book)}
              >
                <CardContent className="p-4">
                  <p className="font-medium text-white">{book.title}</p>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!showNewBook ? (
          <Button
            variant="outline"
            className="w-full min-h-[44px]"
            onClick={() => setShowNewBook(true)}
          >
            + 새 책 추가
          </Button>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="책 제목"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-background border-border"
              />
              <Input
                placeholder="저자"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="bg-background border-border"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddBook}
                  disabled={!newTitle.trim()}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  추가
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewBook(false)}
                >
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (phase === 'goal') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold text-white">목표 설정</h1>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="font-medium text-white">{selectedBook?.title}</p>
            <p className="text-sm text-muted-foreground">{selectedBook?.author}</p>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            오늘 목표 페이지 수
          </label>
          <Input
            type="number"
            value={pageGoal}
            onChange={(e) => setPageGoal(e.target.value)}
            className="bg-card border-border text-center text-2xl"
            min="1"
          />
        </div>

        <Button
          onClick={handleStartSession}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] text-base font-medium"
        >
          세션 시작
        </Button>
      </div>
    )
  }

  if (phase === 'active') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">{selectedBook?.title || '독서 중'}</p>
          <p className="text-5xl font-mono font-bold text-white">
            {formatTimer(elapsed)}
          </p>
          <p className="text-sm text-muted-foreground">
            목표: {activeSession?.pageGoal || pageGoal}페이지
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full min-h-[44px]"
          onClick={() => router.push('/capture')}
        >
          ✏️ 글귀 캡처하기
        </Button>

        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">
            읽은 페이지 수
          </label>
          <Input
            type="number"
            placeholder="0"
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value)}
            className="bg-card border-border text-center text-xl"
            min="0"
          />
          <Button
            onClick={handleEndSession}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 min-h-[48px]"
          >
            세션 종료
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6 text-center">
      <div className="text-4xl">🎉</div>
      <h1 className="text-xl font-bold text-white">세션 완료!</h1>
      <p className="text-muted-foreground">
        {formatTimer(elapsed)} 동안 {pagesRead || 0}페이지를 읽었습니다
      </p>
      <div className="flex gap-3">
        <Button
          onClick={() => {
            setPhase('select')
            setSelectedBook(null)
            setElapsed(0)
            setPagesRead('')
          }}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px]"
        >
          새 세션 시작
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex-1 min-h-[44px]"
        >
          홈으로
        </Button>
      </div>
    </div>
  )
}
