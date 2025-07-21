'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <Sun className={`w-4 h-4 transition-colors duration-300 ${
        isDark ? 'text-gray-400' : 'text-yellow-500'
      }`} />
      
      <button
        onClick={toggleTheme}
        className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDark 
            ? 'bg-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800' 
            : 'bg-gray-300 focus:ring-gray-400 focus:ring-offset-white'
        }`}
        aria-label="Toggle theme"
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`} />
      </button>
      
      <Moon className={`w-4 h-4 transition-colors duration-300 ${
        isDark ? 'text-blue-400' : 'text-gray-400'
      }`} />
    </div>
  )
}

export default ThemeToggle