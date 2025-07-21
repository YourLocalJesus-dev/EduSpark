'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { useTheme } from '@/contexts/ThemeContext'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isDark } = useTheme()

  const signUpWithEmail = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User signed up:', userCredential.user)
      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signUpWithGoogle = async () => {
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('Google sign up success:', result.user)
      router.push('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={`max-w-md mx-auto p-6 mt-5 rounded-xl shadow-md space-y-5 transition-colors
      ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      
      <h2 className={`text-2xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
        Sign Up
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <form onSubmit={signUpWithEmail} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-3 rounded-lg border text-base leading-relaxed 
            focus:outline-none focus:ring-2 focus:ring-purple-500
            ${isDark
              ? 'bg-gray-800 text-white placeholder:text-gray-400 border-gray-700'
              : 'bg-gray-50 text-gray-900 placeholder:text-gray-500 border-gray-300'
            }`}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-3 rounded-lg border text-base leading-relaxed 
            focus:outline-none focus:ring-2 focus:ring-purple-500
            ${isDark
              ? 'bg-gray-800 text-white placeholder:text-gray-400 border-gray-700'
              : 'bg-gray-50 text-gray-900 placeholder:text-gray-500 border-gray-300'
            }`}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div className="flex items-center justify-center">
        <hr className="w-1/3 border-gray-300 dark:border-gray-600" />
        <span className="mx-3 text-gray-400">or</span>
        <hr className="w-1/3 border-gray-300 dark:border-gray-600" />
      </div>

      <button
        onClick={signUpWithGoogle}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition"
      >
        Sign in with Google
      </button>
    </div>
  )
}
