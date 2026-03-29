import { describe, it, expect, beforeEach } from 'vitest'
import { useReadingStore } from '@/lib/reading/store'

describe('ReadingStore', () => {
  beforeEach(() => {
    useReadingStore.setState({
      sessions: [],
      activeSessionId: null,
      streak: {
        current: 0,
        best: 0,
        lastReadDate: null,
        restDayUsedThisWeek: false,
        weekStartDate: '2026-03-23',
      },
      badges: [],
      weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
    })
  })

  it('should start a session', () => {
    const sessionId = useReadingStore.getState().startSession('book-1', 20)

    expect(sessionId).toBeDefined()
    expect(useReadingStore.getState().activeSessionId).toBe(sessionId)

    const session = useReadingStore.getState().getActiveSession()
    expect(session).toBeDefined()
    expect(session?.bookId).toBe('book-1')
    expect(session?.pageGoal).toBe(20)
    expect(session?.captures).toEqual([])
  })

  it('should end a session', () => {
    useReadingStore.getState().startSession('book-1', 20)
    useReadingStore.getState().endSession(15)

    expect(useReadingStore.getState().activeSessionId).toBeNull()

    const sessions = useReadingStore.getState().sessions
    expect(sessions[0].endTime).toBeDefined()
    expect(sessions[0].pagesRead).toBe(15)
  })

  it('should add captures to a session', () => {
    const sessionId = useReadingStore.getState().startSession('book-1', 20)

    const capture = useReadingStore.getState().addCapture(
      sessionId,
      '인상 깊은 구절입니다',
      '나의 메모',
      ['철학', '인생']
    )

    expect(capture.passage).toBe('인상 깊은 구절입니다')
    expect(capture.note).toBe('나의 메모')
    expect(capture.tags).toEqual(['철학', '인생'])

    const session = useReadingStore.getState().getActiveSession()
    expect(session?.captures).toHaveLength(1)
  })

  it('should update a capture', () => {
    const sessionId = useReadingStore.getState().startSession('book-1', 20)
    const capture = useReadingStore.getState().addCapture(sessionId, '구절')

    useReadingStore.getState().updateCapture(sessionId, capture.id, {
      aiInsights: {
        bullets: ['인사이트 1', '인사이트 2', '인사이트 3'],
        question: '생각할 질문',
        keywords: ['키워드1', '키워드2'],
      },
    })

    const session = useReadingStore.getState().getActiveSession()
    const updatedCapture = session?.captures.find((c) => c.id === capture.id)
    expect(updatedCapture?.aiInsights?.bullets).toHaveLength(3)
  })

  it('should get sessions by book', () => {
    useReadingStore.getState().startSession('book-1', 20)
    useReadingStore.getState().endSession(10)
    useReadingStore.getState().startSession('book-2', 30)
    useReadingStore.getState().endSession(20)
    useReadingStore.getState().startSession('book-1', 15)
    useReadingStore.getState().endSession(15)

    const book1Sessions = useReadingStore.getState().getSessionsByBook('book-1')
    expect(book1Sessions).toHaveLength(2)
  })

  it('should update streak on session end', () => {
    useReadingStore.getState().startSession('book-1', 20)
    useReadingStore.getState().endSession(10)

    const streak = useReadingStore.getState().streak
    expect(streak.current).toBe(1)
    expect(streak.lastReadDate).toBeDefined()
  })

  it('should unlock badges at streak thresholds', () => {
    useReadingStore.setState({
      ...useReadingStore.getState(),
      streak: {
        current: 2,
        best: 2,
        lastReadDate: new Date(Date.now() - 86400000).toISOString(),
        restDayUsedThisWeek: false,
        weekStartDate: '2026-03-23',
      },
    })

    useReadingStore.getState().startSession('book-1', 20)
    useReadingStore.getState().endSession(10)

    const badges = useReadingStore.getState().badges
    expect(badges.some((b) => b.type === 'streak-3')).toBe(true)
  })

  it('should update weekly minutes', () => {
    useReadingStore.getState().updateWeeklyMinutes(30)

    const weeklyMinutes = useReadingStore.getState().weeklyMinutes
    const totalMinutes = weeklyMinutes.reduce((sum, m) => sum + m, 0)
    expect(totalMinutes).toBe(30)
  })

  it('should not mutate sessions on add', () => {
    useReadingStore.getState().startSession('book-1', 20)
    const before = useReadingStore.getState().sessions

    useReadingStore.getState().endSession(10)
    const after = useReadingStore.getState().sessions

    expect(before).not.toBe(after)
  })
})
