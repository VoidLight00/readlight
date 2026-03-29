import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Book } from '@/types'

interface BookStore {
  books: Book[]
  addBook: (title: string, author: string, isbn?: string) => Book
  updateBook: (id: string, updates: Partial<Book>) => void
  deleteBook: (id: string) => void
  getBook: (id: string) => Book | undefined
  getBooksByStatus: (status: Book['status']) => Book[]
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      books: [],

      addBook: (title, author, isbn) => {
        const book: Book = {
          id: uuidv4(),
          title,
          author,
          isbn,
          status: 'reading',
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ books: [...state.books, book] }))
        return book
      },

      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, ...updates } : book
          ),
        }))
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }))
      },

      getBook: (id) => {
        return get().books.find((book) => book.id === id)
      },

      getBooksByStatus: (status) => {
        return get().books.filter((book) => book.status === status)
      },
    }),
    { name: 'readlight-books' }
  )
)
