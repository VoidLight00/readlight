import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import {
  startOfWeek,
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns'
import type { ReadingSession, Capture, StreakData, Badge, BadgeType } from '@/types'

const BADGE_DEFINITIONS: Record<BadgeType, { name: string; description: string }> = {
  'streak-3': { name: '3일 연속', description: '3일 연속 독서 달성!' },
  'streak-7': { name: '7일 연속', description: '일주일 연속 독서 달성!' },
  'streak-30': { name: '30일 연속', description: '한 달 연속 독서 달성!' },
  'streak-100': { name: '100일 연속', description: '100일 연속 독서 달성!' },
}

interface ReadingStore {
  sessions: ReadingSession[]
  activeSessionId: string | null
  streak: StreakData
  badges: Badge[]
  weeklyMinutes: number[]

  startSession: (bookId: string, pageGoal: number) => string
  endSession: (pagesRead: number) => void
  getActiveSession: () => ReadingSession | undefined
  getSessionsByBook: (bookId: string) => ReadingSession[]
  addCapture: (sessionId: string, passage: string, note?: string, tags?: string[]) => Capture
  updateCapture: (sessionId: string, captureId: string, updates: Partial<Capture>) => void
  getTodayStats: () => { sessionTime: number; capturesCount: number }
  updateWeeklyMinutes: (minutes: number) => void
}

function checkAndUpdateStreak(streak: StreakData): StreakData {
  const now = new Date()

  if (!streak.lastReadDate) {
    return { ...streak, current: 1, lastReadDate: now.toISOString() }
  }

  const lastRead = parseISO(streak.lastReadDate)

  if (isToday(lastRead)) {
    return streak
  }

  if (isYesterday(lastRead)) {
    const newCurrent = streak.current + 1
    return {
      ...streak,
      current: newCurrent,
      best: Math.max(streak.best, newCurrent),
      lastReadDate: now.toISOString(),
    }
  }

  const daysDiff = differenceInCalendarDays(now, lastRead)

  if (daysDiff === 2 && !streak.restDayUsedThisWeek) {
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const newCurrent = streak.current + 1
    return {
      ...streak,
      current: newCurrent,
      best: Math.max(streak.best, newCurrent),
      lastReadDate: now.toISOString(),
      restDayUsedThisWeek: true,
      weekStartDate: format(weekStart, 'yyyy-MM-dd'),
    }
  }

  return {
    ...streak,
    current: 1,
    lastReadDate: now.toISOString(),
    restDayUsedThisWeek: false,
  }
}

function checkBadges(currentStreak: number, existingBadges: Badge[]): Badge[] {
  const thresholds: BadgeType[] = ['streak-3', 'streak-7', 'streak-30', 'streak-100']
  const streakValues: Record<BadgeType, number> = {
    'streak-3': 3,
    'streak-7': 7,
    'streak-30': 30,
    'streak-100': 100,
  }

  const newBadges = [...existingBadges]

  for (const type of thresholds) {
    if (currentStreak >= streakValues[type]) {
      const exists = newBadges.some((b) => b.type === type)
      if (!exists) {
        newBadges.push({
          type,
          ...BADGE_DEFINITIONS[type],
          unlockedAt: new Date().toISOString(),
        })
      }
    }
  }

  return newBadges
}

const initialStreak: StreakData = {
  current: 0,
  best: 0,
  lastReadDate: null,
  restDayUsedThisWeek: false,
  weekStartDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
}

export const useReadingStore = create<ReadingStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      streak: initialStreak,
      badges: [],
      weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],

      startSession: (bookId, pageGoal) => {
        const session: ReadingSession = {
          id: uuidv4(),
          bookId,
          startTime: new Date().toISOString(),
          pagesRead: 0,
          pageGoal,
          captures: [],
        }
        set((state) => ({
          sessions: [...state.sessions, session],
          activeSessionId: session.id,
        }))
        return session.id
      },

      endSession: (pagesRead) => {
        const { activeSessionId, streak, badges } = get()
        if (!activeSessionId) return

        const endTime = new Date().toISOString()
        const updatedStreak = checkAndUpdateStreak(streak)
        const updatedBadges = checkBadges(updatedStreak.current, badges)

        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === activeSessionId
              ? { ...s, endTime, pagesRead }
              : s
          ),
          activeSessionId: null,
          streak: updatedStreak,
          badges: updatedBadges,
        }))
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get()
        return sessions.find((s) => s.id === activeSessionId)
      },

      getSessionsByBook: (bookId) => {
        return get().sessions.filter((s) => s.bookId === bookId)
      },

      addCapture: (sessionId, passage, note, tags = []) => {
        const capture: Capture = {
          id: uuidv4(),
          sessionId,
          passage,
          note,
          tags,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, captures: [...s.captures, capture] }
              : s
          ),
        }))
        return capture
      },

      updateCapture: (sessionId, captureId, updates) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  captures: s.captures.map((c) =>
                    c.id === captureId ? { ...c, ...updates } : c
                  ),
                }
              : s
          ),
        }))
      },

      getTodayStats: () => {
        const today = format(new Date(), 'yyyy-MM-dd')
        const todaySessions = get().sessions.filter(
          (s) => s.startTime.startsWith(today)
        )

        const sessionTime = todaySessions.reduce((total, s) => {
          if (!s.endTime) return total
          const start = new Date(s.startTime).getTime()
          const end = new Date(s.endTime).getTime()
          return total + (end - start)
        }, 0)

        const capturesCount = todaySessions.reduce(
          (total, s) => total + s.captures.length,
          0
        )

        return { sessionTime, capturesCount }
      },

      updateWeeklyMinutes: (minutes) => {
        const dayIndex = new Date().getDay()
        const mondayIndex = dayIndex === 0 ? 6 : dayIndex - 1
        set((state) => {
          const newWeekly = [...state.weeklyMinutes]
          newWeekly[mondayIndex] = (newWeekly[mondayIndex] || 0) + minutes
          return { weeklyMinutes: newWeekly }
        })
      },
    }),
    { name: 'readlight-reading' }
  )
)
