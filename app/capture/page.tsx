'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CaptureForm } from '@/components/CaptureForm'
import { useReadingStore } from '@/lib/reading/store'
import type { AIInsight } from '@/types'

export default function CapturePage() {
  const { activeSessionId, addCapture, updateCapture } = useReadingStore()

  function handleSave(passage: string, note?: string, tags?: string[], aiInsights?: AIInsight) {
    if (!activeSessionId) return

    const capture = addCapture(activeSessionId, passage, note, tags)

    if (aiInsights) {
      updateCapture(activeSessionId, capture.id, { aiInsights })
    }
  }

  if (!activeSessionId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold text-white">글귀 캡처</h1>
        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <p className="text-4xl mb-3">📖</p>
            <p className="text-muted-foreground">
              세션을 먼저 시작해주세요
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              세션 탭에서 책을 선택하고 독서를 시작하세요
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-white">글귀 캡처</h1>
      <p className="text-sm text-muted-foreground">
        인상 깊은 구절을 기록하세요
      </p>
      <CaptureForm onSave={handleSave} />
    </div>
  )
}
