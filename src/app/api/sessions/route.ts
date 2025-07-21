import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { startedAt } = await req.json()

    const session = {
      id: 1,
      startedAt: new Date(startedAt),
    }

    return NextResponse.json({ session })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
