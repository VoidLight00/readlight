import { format } from 'date-fns'
import type { Book, ReadingSession } from '@/types'

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return `${hours}시간 ${remainingMinutes}분`
  }
  return `${minutes}분`
}

export function generateMarkdown(book: Book, sessions: ReadingSession[]): string {
  const date = format(new Date(), 'yyyy-MM-dd')
  const totalTime = sessions.reduce((total, s) => {
    if (!s.startTime || !s.endTime) return total
    return total + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime())
  }, 0)

  const totalPages = sessions.reduce((total, s) => total + s.pagesRead, 0)
  const allCaptures = sessions.flatMap((s) => s.captures)
  const allTags = [...new Set(allCaptures.flatMap((c) => c.tags))]

  const lines: string[] = [
    '---',
    `title: "${book.title}"`,
    `author: "${book.author}"`,
    `date: ${date}`,
    `tags: [${allTags.map((t) => `"${t}"`).join(', ')}]`,
    `session_time: "${formatDuration(totalTime)}"`,
    `pages_read: ${totalPages}`,
    '---',
    '',
    `# ${book.title}`,
    `**저자**: ${book.author}`,
    '',
  ]

  if (allCaptures.length > 0) {
    lines.push('## 글귀 모음', '')

    for (const capture of allCaptures) {
      lines.push(`> ${capture.passage}`, '')

      if (capture.note) {
        lines.push(`*${capture.note}*`, '')
      }

      if (capture.aiInsights) {
        lines.push('### 인사이트')
        for (const bullet of capture.aiInsights.bullets) {
          lines.push(`- ${bullet}`)
        }
        lines.push('')
        lines.push(`**생각해볼 질문**: ${capture.aiInsights.question}`)
        lines.push('')
        lines.push(`**관련 키워드**: ${capture.aiInsights.keywords.join(', ')}`)
        lines.push('')
      }

      if (capture.tags.length > 0) {
        lines.push(`태그: ${capture.tags.map((t) => `#${t}`).join(' ')}`, '')
      }

      lines.push('---', '')
    }
  }

  return lines.join('\n')
}

export function getExportFilename(book: Book): string {
  const date = format(new Date(), 'yyyy-MM-dd')
  const safeTitle = book.title.replace(/[/\\?%*:|"<>]/g, '-')
  return `${date}-${safeTitle}.md`
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
