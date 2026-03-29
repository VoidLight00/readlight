import { describe, it, expect, beforeEach } from 'vitest'
import { useBookStore } from '@/lib/books/store'

describe('BookStore', () => {
  beforeEach(() => {
    useBookStore.setState({ books: [] })
  })

  it('should add a book', () => {
    const book = useBookStore.getState().addBook('테스트 책', '테스트 저자')

    expect(book.title).toBe('테스트 책')
    expect(book.author).toBe('테스트 저자')
    expect(book.status).toBe('reading')
    expect(book.id).toBeDefined()

    const books = useBookStore.getState().books
    expect(books).toHaveLength(1)
    expect(books[0].id).toBe(book.id)
  })

  it('should add a book with ISBN', () => {
    const book = useBookStore.getState().addBook('ISBN 책', '저자', '978-1234567890')

    expect(book.isbn).toBe('978-1234567890')
  })

  it('should update a book', () => {
    const book = useBookStore.getState().addBook('원래 제목', '저자')

    useBookStore.getState().updateBook(book.id, { status: 'completed' })

    const updated = useBookStore.getState().getBook(book.id)
    expect(updated?.status).toBe('completed')
    expect(updated?.title).toBe('원래 제목')
  })

  it('should delete a book', () => {
    const book = useBookStore.getState().addBook('삭제할 책', '저자')

    useBookStore.getState().deleteBook(book.id)

    expect(useBookStore.getState().books).toHaveLength(0)
    expect(useBookStore.getState().getBook(book.id)).toBeUndefined()
  })

  it('should get books by status', () => {
    useBookStore.getState().addBook('읽는 중 1', '저자1')
    useBookStore.getState().addBook('읽는 중 2', '저자2')
    const completedBook = useBookStore.getState().addBook('완독 책', '저자3')
    useBookStore.getState().updateBook(completedBook.id, { status: 'completed' })

    const reading = useBookStore.getState().getBooksByStatus('reading')
    const completed = useBookStore.getState().getBooksByStatus('completed')

    expect(reading).toHaveLength(2)
    expect(completed).toHaveLength(1)
    expect(completed[0].title).toBe('완독 책')
  })

  it('should not mutate existing books on add', () => {
    useBookStore.getState().addBook('첫 번째', '저자')
    const beforeAdd = useBookStore.getState().books

    useBookStore.getState().addBook('두 번째', '저자')
    const afterAdd = useBookStore.getState().books

    expect(beforeAdd).not.toBe(afterAdd)
    expect(beforeAdd).toHaveLength(1)
    expect(afterAdd).toHaveLength(2)
  })
})
