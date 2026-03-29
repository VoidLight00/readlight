export interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  coverUrl?: string
  status: 'reading' | 'completed' | 'paused'
  createdAt: string
}

export interface ReadingSession {
  id: string
  bookId: string
  startTime: string
  endTime?: string
  pagesRead: number
  pageGoal: number
  captures: Capture[]
}

export interface Capture {
  id: string
  sessionId: string
  passage: string
  note?: string
  tags: string[]
  aiInsights?: AIInsight
  createdAt: string
}

export interface AIInsight {
  bullets: string[]
  question: string
  keywords: string[]
}

export type BadgeType = 'streak-3' | 'streak-7' | 'streak-30' | 'streak-100'

export interface Badge {
  type: BadgeType
  name: string
  description: string
  unlockedAt?: string
}

export interface StreakData {
  current: number
  best: number
  lastReadDate: string | null
  restDayUsedThisWeek: boolean
  weekStartDate: string
}

export interface ReadingStats {
  totalBooksRead: number
  totalSessionTime: number
  totalCaptures: number
  badges: Badge[]
  streak: StreakData
  weeklyMinutes: number[]
}
