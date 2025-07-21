import { useTheme } from '@/contexts/ThemeContext'

interface Props {
  goal: number
  setGoal: (min: number) => void
}

export default function GoalSelector({ goal, setGoal }: Props) {
  const { isDark } = useTheme()

  return (
    <div className={`rounded-xl p-6 shadow-sm transition-colors duration-300 ${
      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <h3 className="font-semibold text-lg mb-2">🎯 Session Goal</h3>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setGoal(goal - 1)} 
          className={`px-3 py-1 rounded transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          -
        </button>
        <span className="text-xl font-medium">{goal}</span>
        <button 
          onClick={() => setGoal(goal + 1)} 
          className={`px-3 py-1 rounded transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          +
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        {[15, 25, 45].map((val) => (
          <button
            key={val}
            onClick={() => setGoal(val)}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              goal === val 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  )
}