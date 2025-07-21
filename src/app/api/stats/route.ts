import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // Replace this mock with real session data from Firebase or other DB
    const sessions = [
      { startedAt: new Date(Date.now() - 7200000), endedAt: new Date(Date.now() - 3600000) },
      { startedAt: new Date(Date.now() - 1800000), endedAt: null },
    ]

    const completedSessions = sessions.filter((s) => s.endedAt !== null)
    const totalSessions = completedSessions.length

    const totalTime = completedSessions.reduce((acc, session) => {
      return acc + (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime())
    }, 0)

    const currentSession = sessions.find((s) => s.endedAt === null)
    const currentDuration = currentSession
      ? Date.now() - new Date(currentSession.startedAt).getTime()
      : 0

    return NextResponse.json({
      totalSessions,
      totalTime,
      currentDuration,
    })
  } catch (err) {
    console.error('❌ /api/stats failed:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
