import { generateInsights, suggestTags } from '@/lib/ai/insights'
import type { AIInsight } from '@/types'

export async function getPassageInsights(passage: string): Promise<AIInsight> {
  return generateInsights(passage)
}

export async function getTagSuggestions(passage: string): Promise<string[]> {
  return suggestTags(passage)
}
