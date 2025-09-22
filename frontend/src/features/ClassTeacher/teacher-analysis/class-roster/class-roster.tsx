import { ChevronDown } from "lucide-react"

export function ClassRoster() {
  const students = [
    { name: "Pruthviraj", status: "Top Performer", type: "good" },
    { name: "Parth", status: "Consistent Progress", type: "good" },
    { name: "Pranav", status: "Consistent Progress", type: "good" },
    { name: "Shaivi", status: "Top Performer", type: "good" },
    { name: "Aarav", status: "Consistent Progress", type: "good" },
    { name: "Rohan", status: "Top Performer", type: "good" },
    { name: "Prashik", status: "Needs Support", type: "support" },
    { name: "Ishita", status: "Needs Support", type: "support" },
  ]

  const goodPerformers = students.filter((s) => s.type === "good")
  const needsSupport = students.filter((s) => s.type === "support")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Class Roster Summary</h3>
        <div className="relative">
          <button className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded-lg text-sm">
            All Students
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Good Performers */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Good Performers</h4>
          <div className="space-y-3">
            {goodPerformers.map((student, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">{student.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                  <p className={`text-xs ${
                    student.status === "Top Performer" ? "text-blue-600" : "text-pink-500"
                  }`}>
                    {student.status === "Top Performer" ? "🏆 " : "⭐ "}
                    {student.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Support */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Needs Support</h4>
          <div className="space-y-3">
            {needsSupport.map((student, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">{student.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                  <p className="text-xs text-red-500">📋 {student.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}