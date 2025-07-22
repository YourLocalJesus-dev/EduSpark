import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: 'Summarize this text simply and clearly in a few lines.' },
          { role: 'user', content: text }
        ]
      })
    });

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content || 'No summary returned.';
    return NextResponse.json({ summary });

  } catch (err) {
    console.error('Groq summarization failed:', err);
    return NextResponse.json({ summary: 'Failed to summarize.' }, { status: 500 });
  }
}
