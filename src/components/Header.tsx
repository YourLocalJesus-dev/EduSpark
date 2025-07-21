'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import ThemeToggle from './ThemeToggle'
import Image from 'next/image'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'AI Chat', href: '/chat' },
  { label: 'Notes', href: '/note' },
  { label: 'Scan', href: '/scan' },
]

const newNavLinks = [
  { label: 'LogIn', href: '/login' },
  { label: 'SignUp', href: '/signup' },
]

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [userEmail, setUserEmail] = useState(null)
  const pathname = usePathname()
  const { isDark } = useTheme()

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email)
      else setUserEmail(null)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUserEmail(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md shadow-md transition-colors duration-300 ${
        isDark
          ? 'bg-gray-900/80 border-b border-gray-700'
          : 'bg-white/80 border-b border-gray-200'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Image src="/zentellect.png" alt="logo" width={30} height={30} priority />
          <div>
            <h1
              className={`text-xl font-semibold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              EduSpark
            </h1>
            <p
              className={`text-xs -mt-1 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Summarize and gamify your learning with AI.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-sm font-medium">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative px-3 py-1 rounded-lg transition-all duration-300 ease-in-out transform 
                ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                delay-[${i * 100}ms]
                ${
                  pathname === link.href
                    ? isDark
                      ? 'bg-orange-900/50 text-orange-400 font-semibold'
                      : 'bg-orange-100 text-orange-600 font-semibold'
                    : isDark
                      ? 'text-gray-300 hover:text-green-400 hover:bg-green-900/30 hover:scale-105'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-100 hover:scale-105'
                }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
          {userEmail ? (
            <>
              <div
                className={`px-3 py-1 rounded-lg ${
                  isDark ? 'text-green-400 bg-green-900/30' : 'text-green-700 bg-green-100'
                }`}
              >
                {userEmail}
              </div>
              <button
                onClick={handleLogout}
                className={`px-3 py-1 rounded-lg transition duration-300 ${
                  isDark
                    ? 'text-red-400 hover:bg-red-900/30'
                    : 'text-red-600 hover:bg-red-100'
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            newNavLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative px-3 py-1 rounded-lg transition-all duration-300 ease-in-out transform 
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                  delay-[${i * 100}ms]
                  ${
                    pathname === link.href
                      ? isDark
                        ? 'bg-orange-900/50 text-orange-400 font-semibold'
                        : 'bg-orange-100 text-orange-600 font-semibold'
                      : isDark
                        ? 'text-gray-300 hover:text-green-400 hover:bg-green-900/30 hover:scale-105'
                        : 'text-gray-600 hover:text-green-700 hover:bg-green-100 hover:scale-105'
                  }`}
              >
                {link.label}
              </a>
            ))
          )}
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
