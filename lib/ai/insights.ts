import type { AIInsight } from '@/types'

export async function generateInsights(passage: string): Promise<AIInsight> {
  const response = await fetch('/api/ai/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passage }),
  })

  if (!response.ok) {
    throw new Error('AI 인사이트 생성 실패')
  }

  return response.json()
}

export async function suggestTags(passage: string): Promise<string[]> {
  const response = await fetch('/api/ai/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passage }),
  })

  if (!response.ok) {
    throw new Error('태그 제안 실패')
  }

  const data = await response.json()
  return data.tags
}

export function isAIAvailable(): boolean {
  return typeof window !== 'undefined'
}
