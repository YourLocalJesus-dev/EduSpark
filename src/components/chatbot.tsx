"use client"

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Message {
  role: 'user' | 'bot'
  content: string
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [topic, setTopic] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const { isDark } = useTheme()

  const handleSend = async () => {
    if (!topic.trim() || !notes.trim()) return

    setMessages(prev => [
      ...prev,
      { role: 'user', content: `Topic: ${topic}\nNotes: ${notes}` }
    ])

    setTopic('')
    setNotes('')

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, notes })
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        { role: 'bot', content: data.reply || '⚠️ No response' }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: '⚠️ Error connecting to AI' }
      ])
    }
  }

  return (
    <div
      className={`min-h-screen px-6 py-10 flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div
        className={`flex-1 overflow-y-auto mb-10 h-[300px] p-5 space-y-4 rounded-2xl border shadow transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-sm px-4 py-2 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed transition-colors duration-300 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : isDark
                  ? 'bg-gray-700 text-gray-100'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="space-y-4 max-w-xl w-full mx-auto"
      >
        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
            isDark
              ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
              : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
          }`}
        />

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            Submit to AI
          </button>
        </div>
      </form>
    </div>
  )
}
