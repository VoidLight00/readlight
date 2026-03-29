'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Book } from '@/types'

interface BookCardProps {
  book: Book
  sessionsCount?: number
  capturesCount?: number
  totalTime?: number
}

const statusLabels: Record<Book['status'], string> = {
  reading: '읽는 중',
  completed: '완독',
  paused: '일시정지',
}

const statusColors: Record<Book['status'], string> = {
  reading: 'bg-primary/20 text-primary',
  completed: 'bg-green-500/20 text-green-400',
  paused: 'bg-muted text-muted-foreground',
}

function formatTime(ms: number): string {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  if (hours > 0) return `${hours}시간 ${minutes}분`
  return `${minutes}분`
}

export function BookCard({ book, sessionsCount = 0, capturesCount = 0, totalTime = 0 }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`}>
      <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex gap-3">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-12 h-16 rounded object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-16 rounded bg-secondary flex items-center justify-center shrink-0 text-xl">
                📖
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-white truncate flex-1 mr-2">
                  {book.title}
                </h3>
                <Badge className={`${statusColors[book.status]} border-0 text-xs shrink-0`}>
                  {statusLabels[book.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>{sessionsCount}회 세션</span>
                <span>{capturesCount}개 글귀</span>
                {totalTime > 0 && <span>{formatTime(totalTime)}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
