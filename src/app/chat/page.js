'use client'

import Chatbot from "../../components/chatbot";
import Header from '../../components/Header'
import { useTheme } from '@/contexts/ThemeContext'

export default function Chat() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
    }`}>      
      <Header />
      <Chatbot />
    </div>
  )
}