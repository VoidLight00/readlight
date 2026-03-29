'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { BookIcon, ExportIcon, TrashIcon, RulerIcon } from '@/components/icons'
import { useBookStore } from '@/lib/books/store'
import { useReadingStore } from '@/lib/reading/store'
import { CaptureCard } from '@/components/CaptureCard'
import { generateMarkdown, getExportFilename, downloadMarkdown } from '@/lib/storage/obsidian'

const statusLabels = {
  reading: '읽는 중',
  completed: '완독',
  paused: '일시정지',
} as const

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  return `${hours}시간 ${minutes % 60}분`
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getBook, updateBook, deleteBook } = useBookStore()
  const { sessions } = useReadingStore()
  const [editingTotalPages, setEditingTotalPages] = useState(false)
  const [totalPagesInput, setTotalPagesInput] = useState('')

  const book = getBook(id)

  if (!book) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">책을 찾을 수 없습니다</p>
        <Button variant="outline" onClick={() => router.push('/library')} className="mt-4">
          서재로 돌아가기
        </Button>
      </div>
    )
  }

  const bookSessions = sessions.filter((s) => s.bookId === id)
  const totalTime = bookSessions.reduce((total, s) => {
    if (!s.endTime) return total
    return total + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime())
  }, 0)
  const pagesReadTotal = bookSessions.reduce((sum, s) => sum + s.pagesRead, 0)
  const allCaptures = bookSessions.flatMap((s) =>
    s.captures.map((c) => ({ ...c, sessionId: s.id }))
  )

  const progressPercent = book.totalPages
    ? Math.min(100, Math.round(((book.currentPage || 0) / book.totalPages) * 100))
    : null

  function handleSetTotalPages() {
    const pages = parseInt(totalPagesInput)
    if (pages > 0) {
      updateBook(id, { totalPages: pages })
    }
    setEditingTotalPages(false)
    setTotalPagesInput('')
  }

  function handleExport() {
    if (!book) return
    const markdown = generateMarkdown(book, bookSessions)
    const filename = getExportFilename(book)
    downloadMarkdown(markdown, filename)
  }

  function handleStatusChange(status: 'reading' | 'completed' | 'paused') {
    updateBook(id, { status })
  }

  function handleDelete() {
    deleteBook(id)
    router.push('/library')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      {/* Book header */}
      <div className="flex items-start gap-4">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            width={80}
            height={110}
            className="w-20 h-[110px] object-cover shrink-0"
          />
        ) : (
          <div className="w-20 h-[110px] bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
            <BookIcon size={28} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h1 className="text-title text-white">{book.title}</h1>
            <Badge className="bg-primary/20 text-primary border-0 shrink-0 ml-2">
              {statusLabels[book.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 border-t border-b border-border py-4">
        <div className="text-center">
          <p className="text-xl font-bold text-white">{bookSessions.length}</p>
          <p className="text-caption mt-1">세션</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{pagesReadTotal}</p>
          <p className="text-caption mt-1">페이지</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{formatTime(totalTime)}</p>
          <p className="text-caption mt-1">총 시간</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        {book.totalPages ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">읽기 진행률</span>
              <span className="text-white font-medium">
                {book.currentPage || 0} / {book.totalPages} 페이지
              </span>
            </div>
            <Progress value={progressPercent ?? 0} />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{progressPercent}%</span>
              <button
                onClick={() => {
                  setTotalPagesInput(String(book.totalPages))
                  setEditingTotalPages(true)
                }}
                className="text-xs text-primary hover:underline"
              >
                수정
              </button>
            </div>
          </>
        ) : !editingTotalPages ? (
          <button
            onClick={() => setEditingTotalPages(true)}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center justify-center gap-2"
          >
            <RulerIcon size={14} />
            총 페이지 수 설정
          </button>
        ) : null}
        {editingTotalPages && (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="총 페이지 수"
              value={totalPagesInput}
              onChange={(e) => setTotalPagesInput(e.target.value)}
              className="bg-[#111111] border-border min-h-[44px]"
              min="1"
              autoFocus
            />
            <Button onClick={handleSetTotalPages} className="min-h-[44px]">
              저장
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingTotalPages(false)
                setTotalPagesInput('')
              }}
              className="min-h-[44px]"
            >
              취소
            </Button>
          </div>
        )}
      </div>

      {/* Status buttons */}
      <div className="flex gap-2">
        <Button
          variant={book.status === 'reading' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusChange('reading')}
          className="flex-1 min-h-[44px]"
        >
          읽는 중
        </Button>
        <Button
          variant={book.status === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusChange('completed')}
          className="flex-1 min-h-[44px]"
        >
          완독
        </Button>
        <Button
          variant={book.status === 'paused' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusChange('paused')}
          className="flex-1 min-h-[44px]"
        >
          일시정지
        </Button>
      </div>

      {/* Captures */}
      {allCaptures.length > 0 && (
        <div className="space-y-3 border-t border-border pt-6">
          <p className="text-caption">캡처한 글귀 ({allCaptures.length})</p>
          {allCaptures.map((capture) => (
            <CaptureCard
              key={capture.id}
              capture={capture}
              sessionId={capture.sessionId}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleExport}
          className="w-full min-h-[44px] gap-2"
        >
          <ExportIcon size={16} />
          옵시디언으로 내보내기
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="w-full min-h-[44px] text-destructive hover:text-destructive gap-2"
        >
          <TrashIcon size={16} />
          책 삭제
        </Button>
      </div>
    </div>
  )
}
