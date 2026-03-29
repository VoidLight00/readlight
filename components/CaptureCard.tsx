'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { useReadingStore } from '@/lib/reading/store'
import type { Capture } from '@/types'

interface CaptureCardProps {
  capture: Capture
  sessionId: string
  bookInfo?: string
}

export function CaptureCard({ capture, sessionId, bookInfo }: CaptureCardProps) {
  const { updateCapture, deleteCapture } = useReadingStore()
  const [editing, setEditing] = useState(false)
  const [passage, setPassage] = useState(capture.passage)
  const [note, setNote] = useState(capture.note || '')
  const [tags, setTags] = useState<string[]>(capture.tags)
  const [tagInput, setTagInput] = useState('')

  function handleSave() {
    updateCapture(sessionId, capture.id, {
      passage,
      note: note || undefined,
      tags,
    })
    setEditing(false)
  }

  function handleCancel() {
    setPassage(capture.passage)
    setNote(capture.note || '')
    setTags(capture.tags)
    setTagInput('')
    setEditing(false)
  }

  function handleDelete() {
    if (window.confirm('이 글귀를 삭제할까요?')) {
      deleteCapture(sessionId, capture.id)
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

  if (editing) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-4 space-y-3">
          <textarea
            className="w-full min-h-[80px] bg-background border border-border rounded-lg p-3 text-white placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
          />
          <Input
            placeholder="메모 (선택사항)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-background border-border"
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="태그 추가..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="bg-background border-border"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary px-2 py-1 rounded flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!passage.trim()}
              className="flex-1 min-h-[44px]"
            >
              <Check className="w-4 h-4 mr-1" />
              저장
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 min-h-[44px]"
            >
              <X className="w-4 h-4 mr-1" />
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-2">
        <p className="text-sm text-white italic">&ldquo;{capture.passage}&rdquo;</p>
        {capture.note && (
          <p className="text-xs text-muted-foreground">{capture.note}</p>
        )}
        {capture.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {capture.tags.map((tag) => (
              <span key={tag} className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {capture.aiInsights && (
          <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/10">
            <ul className="text-xs text-muted-foreground space-y-1">
              {capture.aiInsights.bullets.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>{bookInfo || new Date(capture.createdAt).toLocaleDateString('ko-KR')}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setEditing(true)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-primary transition-colors"
              aria-label="편집"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-destructive transition-colors"
              aria-label="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
