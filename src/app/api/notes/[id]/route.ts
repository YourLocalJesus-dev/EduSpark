import { db } from '@/lib/firebase'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: any) {
  const data = await req.json()
  await updateDoc(doc(db, 'notes', params.id), data)
  return NextResponse.json({ success: true })
}

export async function DELETE(_: Request, { params }: any) {
  await deleteDoc(doc(db, 'notes', params.id))
  return NextResponse.json({ success: true })
}