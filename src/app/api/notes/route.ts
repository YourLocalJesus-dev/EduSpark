import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { NextResponse } from 'next/server'

const notesRef = collection(db, 'notes')

export async function POST(req: Request) {
  const data = await req.json()
  const docRef = await addDoc(notesRef, {
    ...data,
    starred: false,
    createdAt: Date.now(),
  })
  return NextResponse.json({ id: docRef.id })
}

export async function GET() {
  const snapshot = await getDocs(notesRef)
  const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return NextResponse.json(notes)
}
