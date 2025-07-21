'use client'

import Header from '@/components/Header'
import Scan from '@/components/G-Scans'
import { useTheme } from '@/contexts/ThemeContext'

export default function Home() {
  const { isDark } = useTheme()

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-800'
    }`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Scan />
      </div>
    </main>
  )
}