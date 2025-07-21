'use client'

import Signup from "./signup";
import Header from '@/components/Header'
import { useTheme } from '@/contexts/ThemeContext'

export default function makeAccount(){
    const { isDark } = useTheme()

    return(
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-900 text-white' 
              : 'bg-white text-gray-900'
          }`}>
<Header /><Signup />
                </div>
        
    )
}