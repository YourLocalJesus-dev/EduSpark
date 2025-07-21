export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, notes } = body;

    if (!topic || !notes) {
      return new Response(
        JSON.stringify({ reply: 'Missing topic or notes' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const prompt = `Summarize and explain the following notes on "${topic}" like I’m five:\n\n${notes}`;

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await aiRes.json();

    console.log('AI raw response:', JSON.stringify(data, null, 2));

    const reply = data.choices?.[0]?.message?.content || '⚠️ AI returned no response';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ reply: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
