'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPassageInsights } from '@/lib/reading/ai-service'
import type { AIInsight } from '@/types'

interface AICompanionProps {
  passage: string
  onInsightsGenerated: (insights: AIInsight) => void
}

export function AICompanion({ passage, onInsightsGenerated }: AICompanionProps) {
  const [state, setState] = useState<'prompt' | 'loading' | 'result' | 'error'>('prompt')
  const [insights, setInsights] = useState<AIInsight | null>(null)

  async function handleExplore() {
    setState('loading')
    try {
      const result = await getPassageInsights(passage)
      setInsights(result)
      setState('result')
      onInsightsGenerated(result)
    } catch {
      setState('error')
    }
  }

  if (state === 'prompt') {
    return (
      <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <span className="text-sm text-primary">탐구할까요?</span>
        <Button
          size="sm"
          variant="ghost"
          className="text-primary hover:bg-primary/20"
          onClick={handleExplore}
        >
          네!
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setState('error')}
        >
          괜찮아요
        </Button>
      </div>
    )
  }

  if (state === 'loading') {
    return (
      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm text-primary animate-pulse">생각하는 중...</p>
      </div>
    )
  }

  if (state === 'error') {
    return null
  }

  if (state === 'result' && insights) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="text-xs text-primary font-medium mb-2">인사이트</p>
            <ul className="space-y-1">
              {insights.bullets.map((bullet, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-primary font-medium mb-1">생각해볼 질문</p>
            <p className="text-sm text-white italic">{insights.question}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {insights.keywords.map((keyword) => (
              <span
                key={keyword}
                className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
