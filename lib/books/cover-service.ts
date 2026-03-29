const OPEN_LIBRARY_COVERS = 'https://covers.openlibrary.org/b'
const OPEN_LIBRARY_API = 'https://openlibrary.org'

export interface BookInfo {
  title: string
  authors: string[]
  coverUrl: string | null
  isbn: string | null
  publishYear: number | null
}

export async function fetchBookCover(
  title: string,
  author: string
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      title,
      author,
      limit: '1',
    })

    const res = await fetch(
      `${OPEN_LIBRARY_API}/search.json?${params.toString()}`
    )

    if (!res.ok) return null

    const data = await res.json()
    const doc = data?.docs?.[0]

    if (!doc) return null

    if (doc.cover_i) {
      return `${OPEN_LIBRARY_COVERS}/id/${doc.cover_i}-L.jpg`
    }

    const isbn = doc.isbn?.[0]
    if (isbn) {
      return `${OPEN_LIBRARY_COVERS}/isbn/${isbn}-L.jpg`
    }

    return null
  } catch {
    return null
  }
}

export async function fetchBookCoverByIsbn(
  isbn: string
): Promise<string | null> {
  return `${OPEN_LIBRARY_COVERS}/isbn/${isbn}-L.jpg`
}

export async function fetchBookInfo(isbn: string): Promise<BookInfo | null> {
  try {
    const res = await fetch(
      `${OPEN_LIBRARY_API}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    )

    if (!res.ok) return null

    const data = await res.json()
    const book = data[`ISBN:${isbn}`]

    if (!book) return null

    return {
      title: book.title ?? '',
      authors: book.authors?.map((a: { name: string }) => a.name) ?? [],
      coverUrl: book.cover?.large ?? book.cover?.medium ?? null,
      isbn,
      publishYear: book.publish_date
        ? parseInt(book.publish_date, 10) || null
        : null,
    }
  } catch {
    return null
  }
}

export async function searchBooks(query: string): Promise<BookInfo[]> {
  try {
    const params = new URLSearchParams({
      title: query,
      limit: '5',
    })

    const res = await fetch(
      `${OPEN_LIBRARY_API}/search.json?${params.toString()}`
    )

    if (!res.ok) return []

    const data = await res.json()
    const docs = data?.docs ?? []

    return docs.map(
      (doc: {
        title?: string
        author_name?: string[]
        cover_i?: number
        isbn?: string[]
        first_publish_year?: number
      }): BookInfo => ({
        title: doc.title ?? '',
        authors: doc.author_name ?? [],
        coverUrl: doc.cover_i
          ? `${OPEN_LIBRARY_COVERS}/id/${doc.cover_i}-M.jpg`
          : null,
        isbn: doc.isbn?.[0] ?? null,
        publishYear: doc.first_publish_year ?? null,
      })
    )
  } catch {
    return []
  }
}
