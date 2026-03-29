'use client'

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

interface WeeklyChartProps {
  weeklyMinutes: number[]
}

export function WeeklyChart({ weeklyMinutes }: WeeklyChartProps) {
  const maxMinutes = Math.max(...weeklyMinutes, 1)
  const hasData = weeklyMinutes.some((m) => m > 0)

  if (!hasData) {
    return (
      <div className="space-y-2">
        <p className="text-caption">이번 주 독서 시간</p>
        <div className="flex flex-col items-center justify-center h-24 text-center">
          <p className="text-sm text-muted-foreground">
            아직 이번 주 기록이 없습니다
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            첫 세션을 시작해보세요
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-caption">이번 주 독서 시간</p>
      <div className="flex items-end gap-2 h-24">
        {weeklyMinutes.map((minutes, index) => {
          const height = Math.max((minutes / maxMinutes) * 100, 4)
          const isToday = index === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-20">
                {minutes > 0 && (
                  <span className="text-[10px] text-muted-foreground mb-1">
                    {minutes}분
                  </span>
                )}
                <div
                  className={`w-full transition-all ${
                    isToday ? 'bg-primary' : 'bg-primary/40'
                  }`}
                  style={{ height: `${height}%`, minHeight: '3px' }}
                />
              </div>
              <span
                className={`text-xs ${
                  isToday ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}
              >
                {DAY_LABELS[index]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
