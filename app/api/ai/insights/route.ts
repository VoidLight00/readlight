import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API 키가 설정되지 않았습니다' },
      { status: 503 }
    )
  }

  const { passage } = await request.json()
  if (!passage || typeof passage !== 'string') {
    return NextResponse.json(
      { error: '구절이 필요합니다' },
      { status: 400 }
    )
  }

  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `다음 책 구절을 분석해주세요. 호기심 많은 친구처럼 대화하듯 답해주세요.

구절: "${passage}"

JSON 형식으로 답해주세요:
{
  "bullets": ["인사이트 1", "인사이트 2", "인사이트 3"],
  "question": "생각해볼 질문 하나",
  "keywords": ["키워드1", "키워드2", "키워드3"]
}

JSON만 출력하세요.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const insights = JSON.parse(text)
    return NextResponse.json(insights)
  } catch {
    return NextResponse.json(
      { error: 'AI 응답 파싱 실패' },
      { status: 500 }
    )
  }
}
