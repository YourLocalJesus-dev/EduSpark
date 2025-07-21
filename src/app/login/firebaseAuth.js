'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function EmailLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { isDark } = useTheme()

  const login = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('User logged in:', userCredential.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('Google login success:', result.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div
      className={`max-w-md mx-auto mt-5 p-6 rounded-xl shadow-md space-y-5 transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-2xl font-bold text-center">Email Login</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <form onSubmit={login} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
            isDark
              ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400'
              : 'bg-gray-50 text-gray-900 border-gray-300'
          }`}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
            isDark
              ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400'
              : 'bg-gray-50 text-gray-900 border-gray-300'
          }`}
        />
      </form>

      <div className="flex items-center justify-center gap-3">
        <hr className={`flex-1 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
        <span className="text-sm text-gray-400">or</span>
        <hr className={`flex-1 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
      </div>

      <button
        onClick={loginWithGoogle}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
      >
        Sign in with Google
      </button>
    </div>
  )
}
