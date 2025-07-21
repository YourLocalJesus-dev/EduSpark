import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    console.log("📝 Raw OCR text:", text);

    const hfResponse = await fetch("https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    const rawText = await hfResponse.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("❌ HuggingFace returned non-JSON:", rawText);
      return NextResponse.json({ summary: "Invalid response from HuggingFace." }, { status: 500 });
    }

    if (!hfResponse.ok) {
      console.error("❌ HuggingFace error:", data);
      return NextResponse.json({ summary: "Failed to summarize." }, { status: 500 });
    }

    const summary = Array.isArray(data)
      ? data[0]?.summary_text
      : data?.summary_text || "Failed to summarize.";

    return NextResponse.json({ summary });

  } catch (error) {
    console.error("🔥 Summarization error:", error);
    return NextResponse.json({ summary: "Failed to summarize." }, { status: 500 });
  }
}