'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlayIcon, PauseIcon, PenIcon, PlusIcon, ArrowLeftIcon, CheckIcon } from '@/components/icons'
import { useBookStore } from '@/lib/books/store'
import { useReadingStore } from '@/lib/reading/store'
import { fetchBookCover } from '@/lib/books/cover-service'
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
  const { books, addBook, getBook, updateBook } = useBookStore()
  const { activeSessionId, startSession, endSession, pauseSession, resumeSession, getActiveSession, updateWeeklyMinutes } = useReadingStore()

  const [manualPhase, setManualPhase] = useState<'select' | 'goal' | 'active' | 'end'>('select')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [pageGoal, setPageGoal] = useState('20')
  const [pagesRead, setPagesRead] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [showNewBook, setShowNewBook] = useState(false)

  const activeSession = getActiveSession()
  const isPaused = !!activeSession?.pausedAt

  const phase = (activeSessionId && activeSession && manualPhase !== 'end')
    ? 'active'
    : manualPhase

  useEffect(() => {
    if (phase !== 'active') return

    function calcElapsed() {
      const session = getActiveSession()
      if (!session) return 0
      const start = new Date(session.startTime).getTime()
      const now = session.pausedAt
        ? new Date(session.pausedAt).getTime()
        : Date.now()
      return now - start - (session.totalPausedMs || 0)
    }

    setElapsed(calcElapsed()) // eslint-disable-line react-hooks/set-state-in-effect

    const interval = setInterval(() => {
      setElapsed(calcElapsed())
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, getActiveSession, isPaused])

  function handleSelectBook(book: Book) {
    setSelectedBook(book)
    setManualPhase('goal')
  }

  function handleAddBook() {
    if (!newTitle.trim()) return
    const title = newTitle.trim()
    const author = newAuthor.trim() || '작자 미상'
    const book = addBook(title, author)
    setSelectedBook(book)
    setNewTitle('')
    setNewAuthor('')
    setShowNewBook(false)
    setManualPhase('goal')

    fetchBookCover(title, author).then((coverUrl) => {
      if (coverUrl) {
        updateBook(book.id, { coverUrl })
      }
    }).catch(() => {
      // Cover fetch failed — non-critical, continue without cover
    })
  }

  function handleStartSession() {
    if (!selectedBook) return
    startSession(selectedBook.id, parseInt(pageGoal) || 20)
    setManualPhase('active')
  }

  const handleEndSession = useCallback(() => {
    const pages = parseInt(pagesRead) || 0
    const minutes = Math.floor(elapsed / 60000)
    endSession(pages)
    updateWeeklyMinutes(minutes)

    if (selectedBook && pages > 0) {
      const currentBook = getBook(selectedBook.id)
      if (currentBook) {
        updateBook(selectedBook.id, {
          currentPage: (currentBook.currentPage || 0) + pages,
        })
      }
    }

    setManualPhase('end')
  }, [pagesRead, elapsed, endSession, updateWeeklyMinutes, selectedBook, getBook, updateBook])

  if (phase === 'select') {
    const readingBooks = books.filter((b) => b.status === 'reading')

    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <h1 className="text-title text-white">독서 세션</h1>
        <p className="text-sm text-muted-foreground">어떤 책을 읽을까요?</p>

        {readingBooks.length > 0 && (
          <div className="space-y-2">
            {readingBooks.map((book) => (
              <div
                key={book.id}
                className="border border-border hover:border-primary/50 transition-colors cursor-pointer p-4"
                onClick={() => handleSelectBook(book)}
              >
                <p className="font-medium text-white">{book.title}</p>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            ))}
          </div>
        )}

        {!showNewBook ? (
          <Button
            variant="outline"
            className="w-full min-h-[44px] gap-1.5"
            onClick={() => setShowNewBook(true)}
          >
            <PlusIcon size={16} />
            새 책 추가
          </Button>
        ) : (
          <div className="border border-border p-4 space-y-3">
            <Input
              placeholder="책 제목"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-[var(--surface-1)] border-border"
            />
            <Input
              placeholder="저자"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="bg-[var(--surface-1)] border-border"
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
          </div>
        )}
      </div>
    )
  }

  if (phase === 'goal') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <h1 className="text-title text-white">목표 설정</h1>
        <div className="border-l-[3px] border-l-primary pl-4 py-2">
          <p className="font-medium text-white">{selectedBook?.title}</p>
          <p className="text-sm text-muted-foreground">{selectedBook?.author}</p>
        </div>

        <div className="space-y-2">
          <label className="text-caption">오늘 목표 페이지 수</label>
          <Input
            type="number"
            value={pageGoal}
            onChange={(e) => setPageGoal(e.target.value)}
            className="bg-[var(--surface-1)] border-border text-center text-2xl"
            min="1"
          />
        </div>

        <Button
          onClick={handleStartSession}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] font-bold"
        >
          세션 시작
        </Button>
      </div>
    )
  }

  if (phase === 'active') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeftIcon size={20} />
          </button>
          <p className="text-sm text-muted-foreground">
            목표: {activeSession?.pageGoal || pageGoal}쪽
          </p>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm text-white">{selectedBook?.title || '독서 중'}</p>
          <p className="text-caption">{selectedBook?.author}</p>
        </div>

        <div className="text-center space-y-4">
          <p className="text-5xl font-mono font-bold text-white tracking-wider" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatTimer(elapsed)}
          </p>
          <div className="w-24 h-[2px] bg-primary mx-auto" />
          {isPaused && (
            <p className="text-sm text-primary">일시정지 중</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 min-h-[44px] gap-2"
            onClick={() => isPaused ? resumeSession() : pauseSession()}
          >
            {isPaused ? <><PlayIcon size={16} /> 재개</> : <><PauseIcon size={16} /> 일시정지</>}
          </Button>
          <Button
            variant="outline"
            className="flex-1 min-h-[44px] gap-2"
            onClick={() => router.push('/capture')}
          >
            <PenIcon size={16} /> 캡처하기
          </Button>
        </div>

        <div className="border-t border-border pt-6 space-y-3">
          <label className="text-caption">읽은 페이지 수</label>
          <Input
            type="number"
            placeholder="0"
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value)}
            className="bg-[var(--surface-1)] border-border text-center text-xl"
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
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6 text-center">
      <CheckIcon size={40} className="text-primary mx-auto" />
      <h1 className="text-title text-white">세션 완료</h1>
      <p className="text-muted-foreground">
        {formatTimer(elapsed)} 동안 {pagesRead || 0}페이지를 읽었습니다
      </p>
      <div className="flex gap-3">
        <Button
          onClick={() => {
            setManualPhase('select')
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
