import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ summary: "Missing input text." }, { status: 400 });
    }

    const prompt = `Summarize this clearly and concisely:\n\n${text}`;

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const result = await aiResponse.json();

    const summary = result?.choices?.[0]?.message?.content || "⚠️ No summary generated.";

    return NextResponse.json({ summary });

  } catch (error) {
    console.error("❌ AI Summarization Error:", error);
    return NextResponse.json({ summary: "⚠️ Internal error occurred." }, { status: 500 });
  }
}
