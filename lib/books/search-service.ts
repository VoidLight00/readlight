const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes'

export interface GoogleBookResult {
  id: string
  title: string
  authors: string[]
  coverUrl: string | null
  isbn: string | null
  description: string | null
  publishedDate: string | null
  pageCount: number | null
}

interface GoogleVolumeInfo {
  title?: string
  authors?: string[]
  description?: string
  publishedDate?: string
  pageCount?: number
  imageLinks?: {
    thumbnail?: string
    smallThumbnail?: string
  }
  industryIdentifiers?: Array<{
    type: string
    identifier: string
  }>
}

interface GoogleVolume {
  id: string
  volumeInfo: GoogleVolumeInfo
}

function extractIsbn(identifiers?: GoogleVolumeInfo['industryIdentifiers']): string | null {
  if (!identifiers) return null
  const isbn13 = identifiers.find((id) => id.type === 'ISBN_13')
  const isbn10 = identifiers.find((id) => id.type === 'ISBN_10')
  return isbn13?.identifier ?? isbn10?.identifier ?? null
}

function toHttps(url: string | undefined): string | null {
  if (!url) return null
  return url.replace(/^http:/, 'https:')
}

export async function searchGoogleBooks(
  query: string,
  maxResults = 5
): Promise<GoogleBookResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      maxResults: String(maxResults),
      printType: 'books',
    })

    const res = await fetch(`${GOOGLE_BOOKS_API}?${params.toString()}`)

    if (!res.ok) return []

    const data = await res.json()
    const items: GoogleVolume[] = data?.items ?? []

    return items.map((item): GoogleBookResult => {
      const info = item.volumeInfo
      return {
        id: item.id,
        title: info.title ?? '',
        authors: info.authors ?? [],
        coverUrl: toHttps(info.imageLinks?.thumbnail),
        isbn: extractIsbn(info.industryIdentifiers),
        description: info.description ?? null,
        publishedDate: info.publishedDate ?? null,
        pageCount: info.pageCount ?? null,
      }
    })
  } catch {
    return []
  }
}

export async function getGoogleBookById(
  volumeId: string
): Promise<GoogleBookResult | null> {
  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}/${volumeId}`)

    if (!res.ok) return null

    const item: GoogleVolume = await res.json()
    const info = item.volumeInfo

    return {
      id: item.id,
      title: info.title ?? '',
      authors: info.authors ?? [],
      coverUrl: toHttps(info.imageLinks?.thumbnail),
      isbn: extractIsbn(info.industryIdentifiers),
      description: info.description ?? null,
      publishedDate: info.publishedDate ?? null,
      pageCount: info.pageCount ?? null,
    }
  } catch {
    return null
  }
}
