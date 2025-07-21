'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { Pencil, Trash2, Star } from 'lucide-react'

type Note = {
  id: string
  title: string
  tag: string
  content: string
  date: string
  starred: boolean
}

export default function NotesPage() {
  const { isDark } = useTheme()

  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({ title: '', tag: '', content: '' })

  const notesRef = collection(db, 'notes')

  const fetchNotes = async () => {
    const snapshot = await getDocs(notesRef)
    const fetched: Note[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        tag: data.tag,
        content: data.content,
        starred: data.starred || false,
        date: data.date || new Date().toLocaleDateString(),
      }
    })
    setNotes(fetched)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleSaveNote = async () => {
    const today = new Date().toLocaleDateString()

    if (isEditing && editingNoteId) {
      await updateDoc(doc(db, 'notes', editingNoteId), {
        ...newNote,
        date: today,
      })
    } else {
      await addDoc(notesRef, {
        ...newNote,
        starred: false,
        date: today,
        createdAt: Timestamp.now(),
      })
    }

    resetModal()
    fetchNotes()
  }

  const handleEdit = (note: Note) => {
    setIsEditing(true)
    setEditingNoteId(note.id)
    setNewNote({ title: note.title, tag: note.tag, content: note.content })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'notes', id))
    fetchNotes()
  }

  const toggleStar = async (note: Note) => {
    const docRef = doc(db, 'notes', note.id)
    await updateDoc(docRef, { starred: !note.starred })
    fetchNotes()
  }

  const resetModal = () => {
    setShowModal(false)
    setIsEditing(false)
    setEditingNoteId(null)
    setNewNote({ title: '', tag: '', content: '' })
  }

  const filteredNotes = notes.filter((note) =>
    [note.title, note.tag, note.content].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  )
  const starredNotes = filteredNotes.filter((note) => note.starred)
  const normalNotes = filteredNotes.filter((note) => !note.starred)

  const renderNoteCard = (note: Note) => (
    <div
      key={note.id}
      className={`rounded-2xl p-5 shadow border transition-all duration-200 hover:shadow-md ${
        isDark
          ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-750'
          : 'bg-white border-gray-100 text-gray-900 hover:bg-gray-50'
      } ${note.starred ? 'ring-2 ring-yellow-400' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {note.title}
        </h3>
        <button onClick={() => toggleStar(note)}>
          <Star
            size={20}
            className={`cursor-pointer transition-colors duration-200 ${
              note.starred
                ? 'text-yellow-400 fill-yellow-400'
                : isDark
                ? 'text-gray-500 hover:text-yellow-400'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          />
        </button>
      </div>
      <span
        className={`inline-block text-sm px-3 py-1 rounded-full mb-3 ${
          isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'
        }`}
      >
        {note.tag}
      </span>
      <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {note.content}
      </p>
      <div
        className={`flex justify-between items-center text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        <span>{note.date}</span>
        <div className="flex gap-3">
          <Pencil
            size={18}
            onClick={() => handleEdit(note)}
            className={`cursor-pointer transition-colors duration-200 ${
              isDark ? 'hover:text-purple-400' : 'hover:text-purple-500'
            }`}
          />
          <Trash2
            size={18}
            onClick={() => handleDelete(note.id)}
            className={`cursor-pointer transition-colors duration-200 ${
              isDark ? 'hover:text-red-400' : 'hover:text-red-500'
            }`}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6">
      <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Study Notes
      </h1>
      <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Organize your learning with smart note-taking
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search your notes..."
          className={`w-full p-3 rounded-xl border shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-purple-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500'
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            setIsEditing(false)
            setEditingNoteId(null)
            setNewNote({ title: '', tag: '', content: '' })
            setShowModal(true)
          }}
          className="w-full sm:w-auto px-5 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-200"
        >
          + New Note
        </button>
      </div>

      {starredNotes.length > 0 && (
        <>
          <h2
            className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            ⭐ Starred Notes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {starredNotes.map(renderNoteCard)}
          </div>
        </>
      )}

      <h2
        className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        📖 All Notes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {normalNotes.map(renderNoteCard)}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`p-6 rounded-2xl w-full max-w-md shadow-xl ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {isEditing ? 'Edit Note' : 'Create New Note'}
            </h2>

            <input
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className={`w-full mb-3 p-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500'
              }`}
            />
            <input
              placeholder="Tag"
              value={newNote.tag}
              onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
              className={`w-full mb-3 p-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500'
              }`}
            />
            <textarea
              placeholder="Content"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              className={`w-full mb-3 p-2 border rounded-md h-24 transition-all duration-200 focus:outline-none focus:ring-2 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500'
              }`}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={resetModal}
                className={`px-4 py-2 rounded transition-colors duration-200 ${
                  isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-200"
              >
                {isEditing ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
