export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { topic, notes } = await req.json();

    if (!topic || !notes) {
      return new Response('Missing topic or notes', { status: 400 });
    }

    const messages = [
      {
        role: 'user',
        content: `Topic: ${topic}\nNotes: ${notes}`,
      },
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(`Groq API Error: ${err}`, { status: 500 });
    }

    const data = await res.json();
    return Response.json({ reply: data.choices[0].message.content });
  } catch (error: any) {
    return new Response(`Server Error: ${error.message}`, { status: 500 });
  }
}
