export async function fetchBookCover(
  title: string,
  author: string
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      title: title,
      author: author,
      limit: '1',
    })

    const res = await fetch(
      `https://openlibrary.org/search.json?${params.toString()}`
    )

    if (!res.ok) return null

    const data = await res.json()
    const coverId = data?.docs?.[0]?.cover_i

    if (!coverId) return null

    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
  } catch {
    return null
  }
}
