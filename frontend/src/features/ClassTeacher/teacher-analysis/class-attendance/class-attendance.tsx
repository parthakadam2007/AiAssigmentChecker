export function ClassAttendance() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Class Attendance</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#6b7280"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${88 * 2.51} ${(100 - 88) * 2.51}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">88%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-blue-600 font-medium">88%</p>
          <p className="text-gray-600 text-sm">of your students are consistently present.</p>
          <p className="text-pink-500 font-medium text-sm">Excellent participation!</p>
        </div>
      </div>
    </div>
  )
}