'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StreakCounter } from '@/components/StreakCounter'
import { WeeklyChart } from '@/components/WeeklyChart'
import { ChevronRightIcon, PlusIcon, TrophyIcon } from '@/components/icons'
import { useReadingStore } from '@/lib/reading/store'
import { useBookStore } from '@/lib/books/store'

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  return `${hours}시간 ${minutes % 60}분`
}

export default function Dashboard() {
  const { streak, badges, weeklyMinutes, getTodayStats, sessions } = useReadingStore()
  const { books } = useBookStore()

  const todayStats = getTodayStats()
  const totalBooksCompleted = books.filter((b) => b.status === 'completed').length
  const totalCaptures = sessions.reduce((sum, s) => sum + s.captures.length, 0)

  const lastReadingBook = books.find((b) => b.status === 'reading')
  const daysReadThisWeek = weeklyMinutes.filter((m) => m > 0).length

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-title text-white tracking-tight">READLIGHT</h1>
        <Link href="/session">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
            <PlusIcon size={16} />
            세션
          </Button>
        </Link>
      </div>

      {/* Streak hero */}
      <div className="space-y-4">
        <p className="text-caption">오늘</p>
        <StreakCounter streak={streak} badges={badges} />
        <div className="h-[3px] bg-primary w-full" />
      </div>

      {/* Weekly progress */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">이번 주</p>
        <div className="flex-1 h-[2px] bg-border relative">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all"
            style={{ width: `${(daysReadThisWeek / 7) * 100}%` }}
          />
        </div>
        <p className="text-sm text-white font-medium">{daysReadThisWeek}/7일</p>
      </div>

      {/* Today stats */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-2xl font-bold text-white">{formatTime(todayStats.sessionTime)}</p>
          <p className="text-caption mt-1">독서 시간</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{todayStats.capturesCount}</p>
          <p className="text-caption mt-1">캡처한 글귀</p>
        </div>
      </div>

      {/* Last reading book */}
      {lastReadingBook && (
        <div>
          <p className="text-caption mb-3">마지막으로 읽은 책</p>
          <Link href={`/book/${lastReadingBook.id}`}>
            <div className="border-l-[3px] border-l-primary pl-4 py-3 hover:bg-[var(--surface-1)] transition-colors cursor-pointer">
              <p className="text-white font-medium">{lastReadingBook.title}</p>
              <p className="text-sm text-muted-foreground">{lastReadingBook.author}</p>
              <span className="text-sm text-primary mt-2 inline-flex items-center gap-1">
                계속 읽기 <ChevronRightIcon size={14} />
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Weekly chart */}
      <WeeklyChart weeklyMinutes={weeklyMinutes} />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
        <div className="text-center">
          <p className="text-xl font-bold text-white">{totalBooksCompleted}</p>
          <p className="text-caption mt-1">완독한 책</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{sessions.length}</p>
          <p className="text-caption mt-1">총 세션</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{totalCaptures}</p>
          <p className="text-caption mt-1">총 글귀</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Link href="/session" className="flex-1">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] font-bold">
            새 책 시작
          </Button>
        </Link>
        <Link href="/library" className="flex-1">
          <Button variant="outline" className="w-full min-h-[48px] gap-1.5">
            서재 보기 <ChevronRightIcon size={14} />
          </Button>
        </Link>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="border-t border-border pt-6">
          <p className="text-caption mb-3">획득한 배지</p>
          <div className="space-y-2">
            {badges.map((badge) => (
              <div
                key={badge.type}
                className="flex items-center gap-3 border-l-[2px] border-l-primary pl-3 py-2"
              >
                <TrophyIcon size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-sm text-white">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
