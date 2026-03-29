'use client'

import { FlameIcon, MoonIcon, TrophyIcon } from '@/components/icons'
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
      <div className="flex items-center gap-3">
        <span className={`text-primary ${streak.current > 0 ? '' : 'text-muted-foreground'}`}>
          {streak.current > 0 ? <FlameIcon size={24} /> : <MoonIcon size={24} />}
        </span>
        <div>
          <p className="text-display text-white">
            {streak.current}일
          </p>
          <p className="text-caption">
            최고 기록: {streak.best}일
          </p>
        </div>
      </div>

      {streak.restDayUsedThisWeek && (
        <span className="text-xs text-muted-foreground border border-border px-2 py-1">
          이번 주 휴식 사용됨
        </span>
      )}

      {recentBadge && (
        <div className="ml-auto flex items-center gap-1.5 text-primary text-sm">
          <TrophyIcon size={14} />
          <span>{recentBadge.name}</span>
        </div>
      )}
    </div>
  )
}
