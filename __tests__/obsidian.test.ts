import { describe, it, expect } from 'vitest'
import { generateMarkdown, getExportFilename } from '@/lib/storage/obsidian'
import type { Book, ReadingSession } from '@/types'

describe('Obsidian Export', () => {
  const mockBook: Book = {
    id: 'book-1',
    title: '사피엔스',
    author: '유발 하라리',
    status: 'reading',
    createdAt: '2026-03-29T00:00:00Z',
  }

  const mockSessions: ReadingSession[] = [
    {
      id: 'session-1',
      bookId: 'book-1',
      startTime: '2026-03-29T10:00:00Z',
      endTime: '2026-03-29T11:00:00Z',
      totalPausedMs: 0,
      pagesRead: 30,
      pageGoal: 20,
      captures: [
        {
          id: 'capture-1',
          sessionId: 'session-1',
          passage: '인류는 상상의 질서 속에서 살고 있다.',
          note: '흥미로운 관점',
          tags: ['역사', '인류학'],
          createdAt: '2026-03-29T10:30:00Z',
        },
        {
          id: 'capture-2',
          sessionId: 'session-1',
          passage: '돈은 모든 것 중에서 가장 보편적인 상호 신뢰 시스템이다.',
          tags: ['경제'],
          aiInsights: {
            bullets: ['화폐는 신뢰 기반', '보편적 교환 수단', '사회적 합의'],
            question: '디지털 화폐도 같은 신뢰 체계일까?',
            keywords: ['화폐', '신뢰', '경제시스템'],
          },
          createdAt: '2026-03-29T10:45:00Z',
        },
      ],
    },
  ]

  it('should generate valid markdown with frontmatter', () => {
    const md = generateMarkdown(mockBook, mockSessions)

    expect(md).toContain('---')
    expect(md).toContain('title: "사피엔스"')
    expect(md).toContain('author: "유발 하라리"')
    expect(md).toContain('pages_read: 30')
    expect(md).toContain('# 사피엔스')
  })

  it('should include captures', () => {
    const md = generateMarkdown(mockBook, mockSessions)

    expect(md).toContain('인류는 상상의 질서 속에서 살고 있다.')
    expect(md).toContain('흥미로운 관점')
    expect(md).toContain('#역사')
  })

  it('should include AI insights when available', () => {
    const md = generateMarkdown(mockBook, mockSessions)

    expect(md).toContain('화폐는 신뢰 기반')
    expect(md).toContain('디지털 화폐도 같은 신뢰 체계일까?')
    expect(md).toContain('화폐, 신뢰, 경제시스템')
  })

  it('should include tags in frontmatter', () => {
    const md = generateMarkdown(mockBook, mockSessions)

    expect(md).toContain('"역사"')
    expect(md).toContain('"인류학"')
    expect(md).toContain('"경제"')
  })

  it('should generate safe filename', () => {
    const filename = getExportFilename(mockBook)

    expect(filename).toContain('사피엔스')
    expect(filename.endsWith('.md')).toBe(true)
    expect(filename).toMatch(/^\d{4}-\d{2}-\d{2}/)
  })

  it('should sanitize unsafe characters in filename', () => {
    const unsafeBook: Book = {
      ...mockBook,
      title: 'Book/With:Bad*Chars',
    }
    const filename = getExportFilename(unsafeBook)

    expect(filename).not.toContain('/')
    expect(filename).not.toContain(':')
    expect(filename).not.toContain('*')
  })

  it('should handle empty sessions', () => {
    const md = generateMarkdown(mockBook, [])

    expect(md).toContain('# 사피엔스')
    expect(md).toContain('pages_read: 0')
    expect(md).not.toContain('## 글귀 모음')
  })
})
