'use client'

import Header from '@/components/Header'
import EmailLogin from './firebaseAuth'
import { useTheme } from '@/contexts/ThemeContext'

export default function LoginPage() {
  const { isDark } = useTheme()

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <Header />
      <main className="flex justify-center items-center py-12 px-4">
        <EmailLogin />
      </main>
    </div>
  )
}
