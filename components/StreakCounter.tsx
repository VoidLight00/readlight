'use client'

import type { StreakData, Badge } from '@/types'

interface StreakCounterProps {
  streak: StreakData
  badges: Badge[]
}

export function StreakCounter({ streak, badges }: StreakCounterProps) {
  const recentBadge = badges
    .filter((b) => b.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())[0]

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className={`text-3xl ${streak.current > 0 ? 'flame-pulse' : ''}`}>
          {streak.current > 0 ? '🔥' : '💤'}
        </span>
        <div>
          <p className="text-2xl font-bold text-white">
            {streak.current}일
          </p>
          <p className="text-xs text-muted-foreground">
            최고 기록: {streak.best}일
          </p>
        </div>
      </div>

      {streak.restDayUsedThisWeek && (
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
          이번 주 휴식 사용됨
        </span>
      )}

      {recentBadge && (
        <div className="badge-unlock ml-auto">
          <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">
            🏆 {recentBadge.name}
          </span>
        </div>
      )}
    </div>
  )
}
