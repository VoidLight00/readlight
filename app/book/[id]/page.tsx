'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBookStore } from '@/lib/books/store'
import { useReadingStore } from '@/lib/reading/store'
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

  const book = getBook(id)

  if (!book) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
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
  const totalPages = bookSessions.reduce((sum, s) => sum + s.pagesRead, 0)
  const allCaptures = bookSessions.flatMap((s) => s.captures)

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
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{book.title}</h1>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-0">
          {statusLabels[book.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-primary">{bookSessions.length}</p>
            <p className="text-xs text-muted-foreground">세션</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-primary">{totalPages}</p>
            <p className="text-xs text-muted-foreground">페이지</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-primary">{formatTime(totalTime)}</p>
            <p className="text-xs text-muted-foreground">총 시간</p>
          </CardContent>
        </Card>
      </div>

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

      {allCaptures.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-white">
            캡처한 글귀 ({allCaptures.length})
          </p>
          {allCaptures.map((capture) => (
            <Card key={capture.id} className="bg-card border-border">
              <CardContent className="p-4 space-y-2">
                <p className="text-sm text-white italic">&ldquo;{capture.passage}&rdquo;</p>
                {capture.note && (
                  <p className="text-xs text-muted-foreground">{capture.note}</p>
                )}
                {capture.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {capture.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {capture.aiInsights && (
                  <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/10">
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {capture.aiInsights.bullets.map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-2 pt-4">
        <Button
          variant="outline"
          onClick={handleExport}
          className="w-full min-h-[44px]"
        >
          📝 옵시디언으로 내보내기
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="w-full min-h-[44px] text-destructive hover:text-destructive"
        >
          책 삭제
        </Button>
      </div>
    </div>
  )
}
