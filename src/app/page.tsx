'use client'

import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />
      <main className="flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`text-4xl md:text-6xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}
        >
          Welcome to EduSpark
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className={`text-lg md:text-xl max-w-xl ${isDark ? 'text-gray-400' : 'text-gray-700'}`}
        > 
          Organize your study sessions, manage your notes, and stay ahead.
        </motion.p>
      </main>
    </div>
  );
}
