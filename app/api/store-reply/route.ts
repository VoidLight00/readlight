import { NextRequest, NextResponse } from 'next/server'

interface Reply {
  id: string
  text: string
  timestamp: number
  questionId?: string
}

// In-memory store (resets on cold start — acceptable for MVP)
const replies = new Map<string, Reply[]>()

const AUTH_TOKEN = process.env.KRAKEN_REPLY_TOKEN || 'kraken-readlight-2026'

export async function POST(req: NextRequest) {
  const auth = (req.headers.get('x-kraken-token') || '').trim()
  if (auth !== AUTH_TOKEN.trim()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sessionKey, text, questionId } = await req.json()
  if (!sessionKey || !text) {
    return NextResponse.json(
      { error: 'sessionKey and text required' },
      { status: 400 }
    )
  }

  const entry: Reply = {
    id: Date.now().toString(),
    text: typeof text === 'string' ? text.slice(0, 2000) : '',
    timestamp: Date.now(),
    questionId,
  }

  const existing = replies.get(sessionKey) || []
  replies.set(sessionKey, [...existing.slice(-20), entry])

  return NextResponse.json({ ok: true, id: entry.id })
}

export async function GET(req: NextRequest) {
  const sessionKey = req.nextUrl.searchParams.get('sessionKey')
  const since = parseInt(req.nextUrl.searchParams.get('since') || '0')

  if (!sessionKey) {
    return NextResponse.json({ replies: [] })
  }

  const all = replies.get(sessionKey) || []
  const filtered = since ? all.filter((r) => r.timestamp > since) : all

  return NextResponse.json({ replies: filtered })
}
