import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: query },
        ],
      }),
    })

    const data = await response.json()

    const reply = data?.choices?.[0]?.message?.content || 'No response from AI.'

    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json({ reply: '⚠️ Error connecting to AI' }, { status: 500 })
  }
}
