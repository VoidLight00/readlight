'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SparkleIcon, XIcon } from '@/components/icons'
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
      <div className="flex items-center gap-3 p-3 border-l-[3px] border-l-primary bg-surface-1">
        <SparkleIcon size={16} className="text-primary shrink-0" />
        <span className="text-sm text-muted-foreground">탐구할까요?</span>
        <Button
          size="sm"
          variant="ghost"
          className="text-primary"
          onClick={handleExplore}
        >
          네
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
      <div className="flex items-center gap-3 p-3 border-l-[3px] border-l-primary bg-[#111111]">
        <SparkleIcon size={16} className="text-primary shrink-0 animate-pulse" />
        <p className="text-sm text-muted-foreground">생각하는 중...</p>
      </div>
    )
  }

  if (state === 'error') {
    return null
  }

  if (state === 'result' && insights) {
    return (
      <div className="border-l-[3px] border-l-primary bg-[#111111] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <SparkleIcon size={16} className="text-primary" />
          <button onClick={() => setState('error')} className="text-muted-foreground">
            <XIcon size={14} />
          </button>
        </div>

        <ul className="space-y-1">
          {insights.bullets.map((bullet, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-primary">·</span>
              {bullet}
            </li>
          ))}
        </ul>

        <div>
          <p className="text-caption mb-1">생각해볼 질문</p>
          <p className="text-sm text-white italic">{insights.question}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {insights.keywords.map((keyword) => (
            <span
              key={keyword}
              className="text-xs border border-border px-2 py-1 text-muted-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return null
}
