'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StreakCounter } from '@/components/StreakCounter'
import { WeeklyChart } from '@/components/WeeklyChart'
import { BookIcon, TrophyIcon } from '@/components/icons'
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">ReadLight</h1>
        <p className="text-sm text-muted-foreground">독서 동반자</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <StreakCounter streak={streak} badges={badges} />
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium text-white">오늘의 기록</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatTime(todayStats.sessionTime)}
              </p>
              <p className="text-xs text-muted-foreground">독서 시간</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {todayStats.capturesCount}
              </p>
              <p className="text-xs text-muted-foreground">캡처한 글귀</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link href="/session">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] text-base font-medium">
          독서 시작하기
        </Button>
      </Link>

      {lastReadingBook && (
        <Link href={`/book/${lastReadingBook.id}`}>
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer mt-3">
            <CardContent className="p-4 flex items-center gap-3">
              <BookIcon size={24} className="text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{lastReadingBook.title}</p>
                <p className="text-xs text-muted-foreground">이어서 읽기</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <WeeklyChart weeklyMinutes={weeklyMinutes} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-primary">{totalBooksCompleted}</p>
            <p className="text-xs text-muted-foreground">완독한 책</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-primary">{sessions.length}</p>
            <p className="text-xs text-muted-foreground">총 세션</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-primary">{totalCaptures}</p>
            <p className="text-xs text-muted-foreground">총 글귀</p>
          </CardContent>
        </Card>
      </div>

      {badges.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-white mb-3">획득한 배지</p>
            <div className="flex gap-3 flex-wrap">
              {badges.map((badge) => (
                <div
                  key={badge.type}
                  className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg"
                >
                  <TrophyIcon size={16} className="text-primary shrink-0" />
                  <div>
                    <p className="text-sm text-white">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
