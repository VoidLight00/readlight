'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookCard } from '@/components/BookCard'
import { LibraryIcon } from '@/components/icons'
import { useBookStore } from '@/lib/books/store'
import { useReadingStore } from '@/lib/reading/store'

export default function LibraryPage() {
  const { books } = useBookStore()
  const { sessions } = useReadingStore()
  const [tab, setTab] = useState('all')

  function getBookStats(bookId: string) {
    const bookSessions = sessions.filter((s) => s.bookId === bookId)
    const sessionsCount = bookSessions.length
    const capturesCount = bookSessions.reduce((sum, s) => sum + s.captures.length, 0)
    const totalTime = bookSessions.reduce((total, s) => {
      if (!s.endTime) return total
      return total + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime())
    }, 0)
    return { sessionsCount, capturesCount, totalTime }
  }

  const filteredBooks = tab === 'all'
    ? books
    : books.filter((b) => b.status === tab)

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
      <h1 className="text-title text-white">서재</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="reading">읽는 중</TabsTrigger>
          <TabsTrigger value="completed">완독</TabsTrigger>
          <TabsTrigger value="paused">일시정지</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <LibraryIcon size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">아직 등록된 책이 없습니다</p>
              <p className="text-sm text-muted-foreground mt-1">
                세션 탭에서 새 책을 추가해보세요
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredBooks.map((book) => {
                const stats = getBookStats(book.id)
                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    {...stats}
                  />
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
