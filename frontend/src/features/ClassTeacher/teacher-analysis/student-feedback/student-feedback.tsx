export function StudentFeedback() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-2">Student Feedback</h3>
      <p className="text-sm text-gray-600 mb-4">Overall sentiment from students.</p>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" stroke="#e5e7eb" strokeWidth="10" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#3b82f6"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${65 * 2.2} ${(100 - 65) * 2.2}`}
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#f59e0b"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${20 * 2.2} ${(100 - 20) * 2.2}`}
              strokeDashoffset={`${-65 * 2.2}`}
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#ef4444"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${15 * 2.2} ${(100 - 15) * 2.2}`}
              strokeDashoffset={`${-(65 + 20) * 2.2}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">65%</span>
          </div>
        </div>
      </div>
    </div>
  )
}