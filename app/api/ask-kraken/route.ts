import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID
const MAX_QUESTION_LENGTH = 500

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json(
      { error: 'Telegram이 설정되지 않았습니다' },
      { status: 503 }
    )
  }

  const body = await req.json()
  const { book, author, page, question, captures, sessionKey } = body

  if (!question || typeof question !== 'string' || !question.trim()) {
    return NextResponse.json({ error: '질문을 입력해주세요' }, { status: 400 })
  }

  const trimmedQuestion = question.trim().slice(0, MAX_QUESTION_LENGTH)

  const lines = [
    `📖 *[ReadLight]*`,
    `책: ${book || '제목 없음'}${author ? ` — ${author}` : ''}`,
    page ? `페이지: ${page}쪽` : '',
    '',
    `💬 *질문:* ${trimmedQuestion}`,
    captures?.length
      ? `\n📝 *캡처 (${captures.length}건):*\n${captures
          .slice(0, 3)
          .map((c: string) => `• ${c.slice(0, 100)}${c.length > 100 ? '…' : ''}`)
          .join('\n')}`
      : '',
    sessionKey
      ? `\n📬 *답변 방법:*\nPOST https://readlight-one.vercel.app/api/store-reply\nHeader: x-kraken-token\nBody: {"sessionKey":"${sessionKey}","text":"답변 내용"}`
      : '',
  ]
    .filter(Boolean)
    .join('\n')

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: lines,
        parse_mode: 'Markdown',
      }),
    }
  )

  const data = await res.json()
  if (!data.ok) {
    return NextResponse.json({ error: data.description }, { status: 500 })
  }

  return NextResponse.json({ ok: true, messageId: data.result.message_id })
}
