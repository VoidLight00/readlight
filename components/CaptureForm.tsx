'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AICompanion } from '@/components/AICompanion'
import { CameraIcon, SparkleIcon } from '@/components/icons'
import { getTagSuggestions } from '@/lib/reading/ai-service'
import type { AIInsight } from '@/types'

interface CaptureFormProps {
  onSave: (passage: string, note?: string, tags?: string[], aiInsights?: AIInsight) => void
}

export function CaptureForm({ onSave }: CaptureFormProps) {
  const [passage, setPassage] = useState('')
  const [note, setNote] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [aiInsights, setAiInsights] = useState<AIInsight | undefined>()
  const [ocrLoading, setOcrLoading] = useState(false)

  async function handleOCR() {
    setOcrLoading(true)
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'

      const file = await new Promise<File | null>((resolve) => {
        input.onchange = () => resolve(input.files?.[0] ?? null)
        input.click()
      })

      if (!file) {
        setOcrLoading(false)
        return
      }

      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('kor+eng')
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      setPassage(text.trim())
    } catch (error) {
      console.error('OCR 인식 실패:', error)
    } finally {
      setOcrLoading(false)
    }
  }

  function handleAddTag() {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  async function handleSuggestTags() {
    if (!passage) return
    try {
      const suggested = await getTagSuggestions(passage)
      const newTags = [...new Set([...tags, ...suggested])]
      setTags(newTags)
    } catch (error) {
      console.error('태그 제안 실패:', error)
    }
  }

  function handleSave() {
    if (!passage.trim()) return
    onSave(passage, note || undefined, tags, aiInsights)
    setSaved(true)
    setShowAI(true)
  }

  function handleReset() {
    setPassage('')
    setNote('')
    setTags([])
    setTagInput('')
    setSaved(false)
    setShowAI(false)
    setAiInsights(undefined)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="text">
        <TabsList className="bg-secondary">
          <TabsTrigger value="text">텍스트 입력</TabsTrigger>
          <TabsTrigger value="camera">카메라 OCR</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <textarea
            placeholder="인상 깊은 구절을 입력하세요..."
            className="w-full min-h-[120px] bg-[var(--surface-1)] border border-border p-3 text-white placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary"
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            disabled={saved}
          />
        </TabsContent>

        <TabsContent value="camera">
          <div className="border border-border bg-[var(--surface-1)] p-6 text-center">
            <Button
              onClick={handleOCR}
              disabled={ocrLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CameraIcon size={16} />
              <span className="ml-2">{ocrLoading ? '인식 중...' : '사진 찍기'}</span>
            </Button>
            {passage && (
              <p className="mt-3 text-sm text-muted-foreground">
                인식된 텍스트가 입력되었습니다
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {passage && (
        <>
          <textarea
            placeholder="개인 메모 (선택사항)"
            className="w-full min-h-[60px] bg-[var(--surface-1)] border border-border p-3 text-white placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={saved}
          />

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="태그 추가..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                disabled={saved}
                className="bg-[var(--surface-1)] border-border"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSuggestTags}
                disabled={saved}
                className="shrink-0 gap-1.5"
              >
                <SparkleIcon size={14} />
                태그
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs border border-border px-2 py-1 flex items-center gap-1"
                  >
                    #{tag}
                    {!saved && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-muted-foreground hover:text-white"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!saved ? (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={!passage.trim()}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px]"
          >
            저장하기
          </Button>
          {passage.length > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {passage.length}자
            </span>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {showAI && (
            <AICompanion
              passage={passage}
              onInsightsGenerated={(insights) => setAiInsights(insights)}
            />
          )}
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full min-h-[44px]"
          >
            새 글귀 캡처
          </Button>
        </div>
      )}
    </div>
  )
}
