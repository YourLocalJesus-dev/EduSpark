'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' 
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const provider = new GoogleAuthProvider()

export default function GoogleButton() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter() 

  const signInWithGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Google login success:', result.user)
      
      
      router.push('/') 
      
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.info('Popup closed by user.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-4 bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-5">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition"
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  )
}